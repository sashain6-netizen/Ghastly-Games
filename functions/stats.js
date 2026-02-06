export async function onRequest(context) {
  const { request, env } = context;
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. HANDLE VIEWS (GET Request) with 30-minute Cooldown
    if (!isPost) {
      const viewLockKey = `view_lock:${ip}`;
      const hasViewedRecently = await env.LIKES_STORAGE.get(viewLockKey);

      if (!hasViewedRecently) {
        // Increment views in D1
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
        // Set a lock in KV for 1800 seconds (30 minutes)
        await env.LIKES_STORAGE.put(viewLockKey, "true", { expirationTtl: 1800 });
      }
    }

    // 2. HANDLE LIKES (POST Request)
    if (isPost) {
      const likeLockKey = `like_lock:${ip}`;
      const locked = await env.LIKES_STORAGE.get(likeLockKey);
      if (!locked) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
        // Likes usually have a longer cooldown (24 hours = 86400s)
        await env.LIKES_STORAGE.put(likeLockKey, "true", { expirationTtl: 86400 });
      }
    }

    // 3. FETCH UPDATED DATA
    const likesRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_likes'`).first();
    const viewsRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_views'`).first();
    const goldenRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'global_golde_thumbs'`).first();

    return new Response(JSON.stringify({
      likes: likesRow ? likesRow.count : 0,
      views: viewsRow ? viewsRow.count : 0,
      global_total: goldenRow ? goldenRow.count : 0
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, likes: 0, views: 0 }));
  }
}