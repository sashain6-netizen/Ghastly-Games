export async function onRequest(context) {
  const { request, env } = context;
  
  const isPost = request.method === "POST"; // This is a Like click
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. ALWAYS GET THE GOLDEN COUNT (READ ONLY)
    const goldenRow = await env.DB.prepare(`
      SELECT global_golden_thumbs FROM DB WHERE id = 1
    `).first();
    const globalGoldenCount = goldenRow ? goldenRow.global_golden_thumbs : 0;

    // 2. GET CURRENT LIKES/VIEWS (READ ONLY)
    const allStats = await env.DB.prepare("SELECT id, count FROM stats").all();
    const statsMap = Object.fromEntries(allStats.results.map(r => [r.id, r.count]));

    // 3. LOGIC FOR UPDATING (ONLY ON POST)
    if (isPost) {
      const lockKey = `like_lock:${ip}`;
      const alreadyLiked = await env.LIKES_STORAGE.get(lockKey);

      if (!alreadyLiked) {
        // Increment Like in DB
        const updatedLike = await env.DB.prepare(`
          UPDATE stats SET count = count + 1 WHERE id = 'total_likes' RETURNING count
        `).first();
        
        // Lock the IP for 24 hours
        await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: 86400 });
        
        statsMap.total_likes = updatedLike.count;
      }
    }

    // 4. RETURN THE DATA
    // This ensures that on Page Load (GET), we just send back the current numbers
    return new Response(JSON.stringify({
      likes: statsMap.total_likes || 0,
      views: statsMap.total_views || 0,
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