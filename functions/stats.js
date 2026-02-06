export async function onRequest(context) {
  const { request, env } = context;
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. Get Golden Count
    const goldenRow = await env.DB.prepare(`SELECT global_golden_thumbs FROM DB WHERE id = 1`).first();
    const globalGoldenCount = goldenRow ? goldenRow.global_golden_thumbs : 0;

    // 2. GET LIKES/VIEWS (The D1 way)
    const { results } = await env.DB.prepare("SELECT id, count FROM stats").all();
    
    // Manual find to avoid mapping errors if the table is small
    const likesRow = results.find(r => r.id === 'total_likes');
    const viewsRow = results.find(r => r.id === 'total_views');

    const currentLikes = likesRow ? likesRow.count : 0;
    const currentViews = viewsRow ? viewsRow.count : 0;

    // 3. UPDATE LOGIC (ONLY ON POST)
    let finalLikes = currentLikes;
    if (isPost) {
      const lockKey = `like_lock:${ip}`;
      const alreadyLiked = await env.LIKES_STORAGE.get(lockKey);

      if (!alreadyLiked) {
        const updated = await env.DB.prepare(`
          UPDATE stats SET count = count + 1 WHERE id = 'total_likes' RETURNING count
        `).first();
        
        await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: 86400 });
        finalLikes = updated.count;
      }
    }

    // 4. RETURN DATA (Strictly matching frontend keys)
    return new Response(JSON.stringify({
      likes: Number(finalLikes),
      views: Number(currentViews),
      global_total: Number(globalGoldenCount)
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}