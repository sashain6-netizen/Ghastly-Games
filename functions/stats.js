export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";
  const userEmail = url.searchParams.get("email");

  let playerGBucks = null;
  let ownedGames = [];

  try {
    // --- 1. FETCH PLAYER DATA ---
    let userKey = "";
    let userData = null;

    if (userEmail) {
      userKey = `user:${userEmail.toLowerCase().trim()}`;
      // Matches your Variable Name: LIKES_STORAGE
      const userDataRaw = await env.LIKES_STORAGE.get(userKey);
      if (userDataRaw) {
        userData = JSON.parse(userDataRaw);
        playerGBucks = userData['g_bucks'] || 0;
        ownedGames = userData.owned_games || [];
      }
    }

    // --- 2. PURCHASE LOGIC ---
    if (isPost && url.searchParams.get("action") === "purchase") {
      const gameId = url.searchParams.get("gameId");
      const price = parseInt(url.searchParams.get("price") || "0");

      if (!userData) return new Response(JSON.stringify({ error: "User not logged in" }), { status: 401 });
      if (ownedGames.includes(gameId)) return new Response(JSON.stringify({ error: "Already owned!" }), { status: 400 });
      if (playerGBucks < price) return new Response(JSON.stringify({ error: "Insufficient G-Bucks!" }), { status: 400 });

      userData['g_bucks'] = playerGBucks - price;
      userData.owned_games = [...ownedGames, gameId];

      await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));
      playerGBucks = userData['g_bucks'];
      ownedGames = userData.owned_games;
    }

    // --- 3. HANDLE VIEWS ---
    if (!isPost) {
      const viewLockKey = `view_lock:${ip}`;
      const hasViewedRecently = await env.LIKES_STORAGE.get(viewLockKey);
      if (!hasViewedRecently) {
        // SQL FIX: Make sure your D1 table is just 'stats'
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
        await env.LIKES_STORAGE.put(viewLockKey, "true", { expirationTtl: 1800 });
      }
    }

    // --- 4. HANDLE LIKES ---
    if (isPost && !url.searchParams.get("action")) {
      const likeLockKey = `like_lock:${ip}`;
      const locked = await env.LIKES_STORAGE.get(likeLockKey);
      if (!locked) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
        await env.LIKES_STORAGE.put(likeLockKey, "true", { expirationTtl: 86400 });
      }
    }

    // --- 5. FETCH GLOBAL STATS ---
    const likesRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_likes'`).first();
    const viewsRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'total_views'`).first();
    const goldenRow = await env.DB.prepare(`SELECT count FROM stats WHERE id = 'global_golden_thumbs'`).first();

    return new Response(JSON.stringify({
      likes: likesRow?.count || 0,
      views: viewsRow?.count || 0,
      global_total: goldenRow?.count || 0,
      gbucks: playerGBucks,
      owned_games: ownedGames 
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}