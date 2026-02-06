export async function onRequest(context) {
  const { request, env } = context;
  
  const isLike = request.method === "POST";
  const targetId = isLike ? "total_likes" : "total_views";
  const otherId = isLike ? "total_views" : "total_likes";
  
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  let globalCount = await env.LIKES_STORAGE.get("global_golden_count");
  globalCount = parseInt(globalCount) || 0;

  try {
    // --- IP LOCK LOGIC (FOR BOTH LIKES AND VIEWS) ---
    // Views lock for 30 mins (1800s), Likes lock for 24h (86400s)
    const lockKey = isLike ? `like_lock:${ip}` : `view_lock:${ip}`;
    const alreadyLocked = await env.LIKES_STORAGE.get(lockKey);

    if (alreadyLocked) {
      // If locked, just fetch and return totals without updating D1
      const allStats = await env.DB.prepare("SELECT id, count FROM stats").all();
      const statsMap = Object.fromEntries(allStats.results.map(r => [r.id, r.count]));
      
      return new Response(JSON.stringify({
        likes: statsMap.total_likes,
        views: statsMap.total_views,
        message: isLike ? "Already liked" : "View already counted"
      }), { 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    // Set the lock in KV before updating the database
    const expiry = isLike ? 86400 : 1800; 
    await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: expiry });

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
