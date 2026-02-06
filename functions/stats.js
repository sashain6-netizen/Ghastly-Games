export async function onRequest(context) {
  const { request, env } = context;
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. UPDATE LOGIC
    if (isPost) {
      const lockKey = `like_lock:${ip}`;
      const locked = await env.LIKES_STORAGE.get(lockKey);
      if (!locked) {
        // Match the ID 'total_likes' exactly as it is in your D1
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
        await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: 86400 });
      }
    } else {
      // Increment views on every GET request
      await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
    }

    // 2. FETCH LOGIC (Getting the data back out)
    const likesRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_likes'`).first();
    const viewsRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_views'`).first();
    const goldenRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'global_golde_thumbs'`).first();

    // 3. MAP TO JSON
    const responseData = {
      likes: likesRow ? likesRow.count : 0,
      views: viewsRow ? viewsRow.count : 0,
      global_total: goldenRow ? goldenRow.count : 0
    };

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, likes: 0, views: 0 }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}