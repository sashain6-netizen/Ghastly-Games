export async function onRequest(context) {
  const { request, env } = context;
  
  const isLike = request.method === "POST";
  const targetId = isLike ? "total_likes" : "total_views";
  const otherId = isLike ? "total_views" : "total_likes";
  
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. FETCH GLOBAL GOLDEN THUMBS FROM D1
    // We fetch this first so it's available for every response
    const goldenRow = await env.DB.prepare(`
      SELECT global_golden_thumbs FROM DB WHERE id = 1
    `).first();
    const globalGoldenCount = goldenRow ? goldenRow.global_golden_thumbs : 0;

    // --- IP LOCK LOGIC ---
    const lockKey = isLike ? `like_lock:${ip}` : `view_lock:${ip}`;
    const alreadyLocked = await env.LIKES_STORAGE.get(lockKey);

    if (alreadyLocked) {
      const allStats = await env.DB.prepare("SELECT id, count FROM stats").all();
      const statsMap = Object.fromEntries(allStats.results.map(r => [r.id, r.count]));
      
      return new Response(JSON.stringify({
        likes: statsMap.total_likes,
        views: statsMap.total_views,
        global_total: globalGoldenCount, // Include global count even if locked
        message: isLike ? "Already liked" : "View already counted"
      }), { 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    // Set the lock in KV
    const expiry = isLike ? 86400 : 1800; 
    await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: expiry });

    // --- DATABASE UPDATES FOR LIKES/VIEWS ---
    const updatedRow = await env.DB.prepare(`
      UPDATE stats SET count = count + 1 WHERE id = ? RETURNING count
    `).bind(targetId).first();

    const otherRow = await env.DB.prepare(`
      SELECT count FROM stats WHERE id = ?
    `).bind(otherId).first();

    const data = {
      likes: isLike ? updatedRow.count : otherRow.count,
      views: isLike ? otherRow.count : updatedRow.count,
      global_total: globalGoldenCount // Include global count in successful update
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