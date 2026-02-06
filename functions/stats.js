export async function onRequest(context) {
  const { request, env } = context;
  
  const isLike = request.method === "POST";
  const targetId = isLike ? "total_likes" : "total_views";
  const otherId = isLike ? "total_views" : "total_likes";

  try {
    // --- IP LOCK LOGIC FOR LIKES ---
    if (isLike) {
      const ip = request.headers.get("CF-Connecting-IP") || "anonymous";
      const lockKey = `like_lock:${ip}`;

      // 1. Check KV if this IP already liked
      const alreadyLiked = await env.LIKES_STORAGE.get(lockKey);
      
      if (alreadyLiked) {
        // If they already liked, just return current totals without incrementing
        const allStats = await env.DB.prepare("SELECT id, count FROM stats").all();
        const statsMap = Object.fromEntries(allStats.results.map(r => [r.id, r.count]));
        
        return new Response(JSON.stringify({
          likes: statsMap.total_likes,
          views: statsMap.total_views,
          message: "Already liked"
        }), { headers: { "Content-Type": "application/json" } });
      }

      // 2. Lock this IP in KV for 24 hours (86400 seconds)
      await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: 86400 });
    }

    // --- DATABASE UPDATES ---
    const updatedRow = await env.DB.prepare(`
      UPDATE stats SET count = count + 1 WHERE id = ? RETURNING count
    `).bind(targetId).first();

    const otherRow = await env.DB.prepare(`
      SELECT count FROM stats WHERE id = ?
    `).bind(otherId).first();

    const data = {
      likes: isLike ? updatedRow.count : otherRow.count,
      views: isLike ? otherRow.count : updatedRow.count
    };

    return new Response(JSON.stringify(data), {
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
