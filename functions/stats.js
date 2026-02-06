export async function onRequest(context) {
  const { request, env } = context;
  
  const isPost = request.method === "POST"; 
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. GET THE GOLDEN COUNT
    const goldenRow = await env.DB.prepare(`
      SELECT global_golden_thumbs FROM DB WHERE id = 1
    `).first();
    const globalGoldenCount = goldenRow ? goldenRow.global_golden_thumbs : 0;

    // 2. GET LIKES/VIEWS
    const allStats = await env.DB.prepare("SELECT id, count FROM stats").all();
    // This creates a map where keys are 'total_likes' and 'total_views'
    const statsMap = Object.fromEntries(allStats.results.map(r => [r.id, r.count]));

    // 3. UPDATE LOGIC (ONLY ON POST)
    if (isPost) {
      const lockKey = `like_lock:${ip}`;
      const alreadyLiked = await env.LIKES_STORAGE.get(lockKey);

      if (!alreadyLiked) {
        const updatedLike = await env.DB.prepare(`
          UPDATE stats SET count = count + 1 WHERE id = 'total_likes' RETURNING count
        `).first();
        
        await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: 86400 });
        statsMap.total_likes = updatedLike.count;
      }
    }

    // 4. RETURN DATA (Mapped to frontend names)
    return new Response(JSON.stringify({
      // We explicitly map the DB IDs to the names the frontend expects
      likes: statsMap.total_likes ?? 0,
      views: statsMap.total_views ?? 0,
      global_total: globalGoldenCount
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}