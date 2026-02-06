export async function onRequest(context) {
  const { request, env } = context;
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  try {
    // 1. Get Golden Count from the 'DB' table
    const goldenRow = await env.DB.prepare(`SELECT global_golden_thumbs FROM DB WHERE id = 1`).first();
    const globalGoldenCount = goldenRow ? goldenRow.global_golden_thumbs : 0;

    // 2. Fetch EVERYTHING from the 'stats' table
    const { results } = await env.DB.prepare("SELECT * FROM stats").all();
    
    // 3. Fallback logic: If we can't find 'total_likes' by name, take the first/second rows
    let likesRow = results.find(r => String(r.id).includes('like')) || results[0];
    let viewsRow = results.find(r => String(r.id).includes('view')) || results[1];

    let currentLikes = likesRow ? (likesRow.count || likesRow.value || 0) : 0;
    let currentViews = viewsRow ? (viewsRow.count || viewsRow.value || 0) : 0;

    // 4. Handle Like logic
    if (isPost) {
      const lockKey = `like_lock:${ip}`;
      const alreadyLocked = await env.LIKES_STORAGE.get(lockKey);

      if (!alreadyLocked) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = ?`)
          .bind(likesRow.id).run();
        
        await env.LIKES_STORAGE.put(lockKey, "true", { expirationTtl: 86400 });
        currentLikes++;
      }
    }

    // 5. Final JSON - We use "Number()" to prevent "undefined"
    return new Response(JSON.stringify({
      likes: Number(currentLikes) || 0,
      views: Number(currentViews) || 0,
      global_total: Number(globalGoldenCount) || 0
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    // If it crashes, return 0s so the UI doesn't say "undefined"
    return new Response(JSON.stringify({ likes: 0, views: 0, global_total: 0 }), { 
      headers: { "Content-Type": "application/json" }
    });
  }
}