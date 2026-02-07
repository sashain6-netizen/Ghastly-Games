export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";
  const userEmail = url.searchParams.get("email");

  let playerGBucks = 0;
  let ownedGames = [];

  try {
    // --- 1. IDENTIFY & FETCH PLAYER DATA ---
    let userKey = "";
    let userData = null;

    if (userEmail) {
      userKey = `user:${userEmail.toLowerCase().trim()}`;
      const userDataRaw = await env.LIKES_STORAGE.get(userKey);
      if (userDataRaw) {
        userData = JSON.parse(userDataRaw);
        playerGBucks = userData['g_bucks'] || 0;
        ownedGames = userData.owned_games || [];
      }
    }

    // --- 2. NEW: PURCHASE LOGIC (POST action=purchase) ---
    if (isPost && url.searchParams.get("action") === "purchase") {
      const gameId = url.searchParams.get("gameId");
      const price = parseInt(url.searchParams.get("price") || "0");

      if (!userData) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }

      if (ownedGames.includes(gameId)) {
        return new Response(JSON.stringify({ error: "Already owned!" }), { status: 400 });
      }

      if (playerGBucks < price) {
        return new Response(JSON.stringify({ error: "Insufficient G-Bucks!" }), { status: 400 });
      }

      // Update the data
      userData['g_bucks'] = playerGBucks - price;
      userData.owned_games = [...ownedGames, gameId];

      // SAVE TO KV (Crucial: Use await)
      await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));

      // Update local variables for the final response
      playerGBucks = userData['g_bucks'];
      ownedGames = userData.owned_games;
    }

    // --- 3. HANDLE VIEWS (Your existing logic) ---
    if (!isPost) {
      const viewLockKey = `view_lock:${ip}`;
      const hasViewedRecently = await env.LIKES_STORAGE.get(viewLockKey);
      if (!hasViewedRecently) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
        await env.LIKES_STORAGE.put(viewLockKey, "true", { expirationTtl: 1800 });
      }
    }

    // --- 4. HANDLE LIKES (Your existing logic) ---
    if (isPost && !url.searchParams.get("action")) { // Only run if it's a standard like
      const likeLockKey = `like_lock:${ip}`;
      const locked = await env.LIKES_STORAGE.get(likeLockKey);
      if (!locked) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
        await env.LIKES_STORAGE.put(likeLockKey, "true", { expirationTtl: 86400 });
      }
    }

    // --- 5. FETCH GLOBAL STATS & RETURN ---
    const likesRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_likes'`).first();
    const viewsRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_views'`).first();
    const goldenRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'global_golde_thumbs'`).first();

    return new Response(JSON.stringify({
      likes: likesRow ? likesRow.count : 0,
      views: viewsRow ? viewsRow.count : 0,
      global_total: goldenRow ? goldenRow.count : 0,
      gbucks: playerGBucks,
      owned_games: ownedGames // Make sure this is sent back!
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, gbucks: 0 }), { status: 500 });
  }
}
