export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const isPost = request.method === "POST";
  const ip = request.headers.get("CF-Connecting-IP") || "anonymous";
  const userEmail = url.searchParams.get("email");
  const action = url.searchParams.get("action");

  let playerGBucks = null;
  let playerXP = null;
  let ownedGames = [];

  try {
    // --- 1. FETCH PLAYER DATA ---
    let userKey = "";
    let userData = null;

    if (userEmail) {
      userKey = `user:${userEmail.toLowerCase().trim()}`;
      const userDataRaw = await env.LIKES_STORAGE.get(userKey);
      if (userDataRaw) {
        userData = JSON.parse(userDataRaw);
        playerGBucks = userData['g_bucks'] || 0;
        playerXP = userData['xp'] || 0;
        ownedGames = userData.owned_games || [];
      }
    }

    // --- 2. LOGIC BRANCHES ---
    if (isPost) {
      if (!userData) return new Response(JSON.stringify({ error: "User not logged in" }), { status: 401 });

      // ACTION: PURCHASE GAME
      if (action === "purchase") {
        const gameId = url.searchParams.get("gameId");
        const price = parseInt(url.searchParams.get("price") || "0");

        if (ownedGames.includes(gameId)) return new Response(JSON.stringify({ error: "Already owned!" }), { status: 400 });
        if (playerGBucks < price) return new Response(JSON.stringify({ error: "Insufficient G-Bucks!" }), { status: 400 });

        userData['g_bucks'] = playerGBucks - price;
        userData.owned_games = [...ownedGames, gameId];

        await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));
        playerGBucks = userData['g_bucks'];
        ownedGames = userData.owned_games;
      }

      // ACTION: ADD PASSIVE XP (Every 10 mins)
      else if (action === "addXP") {
        const amount = parseInt(url.searchParams.get("amount") || "0");
        const xpLockKey = `xp_lock:${userEmail.toLowerCase().trim()}`;
        
        // Rate limit: Only allow XP claim once every 9.5 minutes (to be safe)
        const isLocked = await env.LIKES_STORAGE.get(xpLockKey);
        if (isLocked) {
          return new Response(JSON.stringify({ error: "XP already claimed too recently." }), { status: 429 });
        }

        userData['xp'] = (userData['xp'] || 0) + amount;
        
        // Save user data and set a 10-minute cooldown
        await Promise.all([
          env.LIKES_STORAGE.put(userKey, JSON.stringify(userData)),
          env.LIKES_STORAGE.put(xpLockKey, "true", { expirationTtl: 570 }) 
        ]);

        playerXP = userData['xp'];
      }

      // ACTION: LIKE (No action param)
      else if (!action) {
        const likeLockKey = `like_lock:${ip}`;
        const locked = await env.LIKES_STORAGE.get(likeLockKey);
        if (!locked) {
          await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
          await env.LIKES_STORAGE.put(likeLockKey, "true", { expirationTtl: 86400 });
        }
      }
    }

    // --- 3. HANDLE VIEWS ---
    if (!isPost) {
      const viewLockKey = `view_lock:${ip}`;
      const hasViewedRecently = await env.LIKES_STORAGE.get(viewLockKey);
      if (!hasViewedRecently) {
        await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
        await env.LIKES_STORAGE.put(viewLockKey, "true", { expirationTtl: 1800 });
      }
    }

    // --- 4. FETCH GLOBAL STATS & RESPOND ---
    const statsQuery = await env.DB.prepare(`SELECT id, count FROM stats`).all();
    const stats = Object.fromEntries(statsQuery.results.map(r => [r.id, r.count]));

    return new Response(JSON.stringify({
      likes: stats.total_likes || 0,
      views: stats.total_views || 0,
      global_total: stats.global_golden_thumbs || 0,
      gbucks: playerGBucks,
      xp: playerXP, // Now returning XP in the response
      owned_games: ownedGames 
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}