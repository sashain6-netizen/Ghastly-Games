export async function onRequest(context) {
  const { request, env } = context;
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. Get Golden Count (Using your exact column name)
    const goldenRow = await env.DB.prepare(`SELECT global_golden_thumbs FROM DB WHERE id = 1`).first();
    const globalCount = goldenRow ? goldenRow.global_golden_thumbs : 0;

    // 2. Get Likes and Views (Using your exact IDs: total_likes, total_views)
    const likesRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_likes'`).first();
    const viewsRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_views'`).first();

    let likes = likesRow ? likesRow.count : 0;
    let views = viewsRow ? viewsRow.count : 0;

    // 3. Handle the Like Click
    if (isPost) {
      const lockKey = `like_lock:${ip}`;
      const locked = await env.LIKES_STORAGE.get(lockKey);
      if (!locked) {
        // Update using the exact ID 'total_likes'
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
        await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: 86400 });
        likes++;
      }
    }

    // 4. Send the data back to the frontend
    return new Response(JSON.stringify({
      likes: likes,
      views: views,
      global_total: globalCount
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, likes: 0, views: 0 }));
  }
}