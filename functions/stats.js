export async function onRequest(context) {
  const { request, env } = context;
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";

  // --- 1. IDENTIFY THE PLAYER ---
  // We get the email from the URL (e.g., /stats?email=sashain6@gmail.com)
  const url = new URL(request.url);
  const userEmail = url.searchParams.get("email");

  let playerGBucks = 0;

  try {
    // --- 2. FETCH PLAYER G-BUCKS ---
    if (userEmail) {
      // Use the exact key format from your login: user:email
      const userKey = `user:${userEmail.toLowerCase().trim()}`;
      const userDataRaw = await env.LIKES_STORAGE.get(userKey);
      
      if (userDataRaw) {
        const userData = JSON.parse(userDataRaw);
        // Using bracket notation for the hyphenated key 'g-bucks'
        playerGBucks = userData['g-bucks'] || 0;
      }
    }

    // --- 3. HANDLE VIEWS (Existing logic) ---
    if (!isPost) {
      const viewLockKey = `view_lock:${ip}`;
      const hasViewedRecently = await env.LIKES_STORAGE.get(viewLockKey);

      if (!hasViewedRecently) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
        await env.LIKES_STORAGE.put(viewLockKey, "true", { expirationTtl: 1800 });
      }
    }

    // --- 4. HANDLE LIKES (Existing logic) ---
    if (isPost) {
      const likeLockKey = `like_lock:${ip}`;
      const locked = await env.LIKES_STORAGE.get(likeLockKey);
      if (!locked) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
        await env.LIKES_STORAGE.put(likeLockKey, "true", { expirationTtl: 86400 });
      }
    }

    // --- 5. FETCH ALL DATA FOR RESPONSE ---
    const likesRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_likes'`).first();
    const viewsRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_views'`).first();
    const goldenRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'global_golde_thumbs'`).first();

    return new Response(JSON.stringify({
      likes: likesRow ? likesRow.count : 0,
      views: viewsRow ? viewsRow.count : 0,
      global_total: goldenRow ? goldenRow.count : 0,
      gbucks: playerGBucks 
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: err.message, 
      likes: 0, 
      views: 0, 
      gbucks: 0 
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
