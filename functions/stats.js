const ADMIN_CONFIG = {
    owners: ['sashain6@gmail.com'],
    coOwners: ['568712@my.cuhsd.org'],
    moderators: ['568974@my.cuhsd.org'] 
};

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
        // --- 1. FETCH PLAYER DATA (For standard game actions) ---
        let userKey = "";
        let userData = null;

        if (userEmail) {
            userKey = `user:${userEmail.toLowerCase().trim()}`;
            const userDataRaw = await env.LIKES_STORAGE.get(userKey);
            if (userDataRaw) {
                userData = JSON.parse(userDataRaw);
                playerGBucks = userData.g_bucks ?? 0;
                playerXP = userData.xp ?? 0;
                ownedGames = userData.owned_games ?? [];
            }
        }

        // --- 2. POST LOGIC BRANCHES ---
        if (isPost) {
            const body = await request.json().catch(() => ({}));

            // ACTION: ADMIN UPDATE (Co-Owners & Owners)
            if (action === "adminUpdate") {
                const adminEmail = (body.adminEmail || "").toLowerCase().trim();
                const targetEmail = (body.targetEmail || "").toLowerCase().trim();
                
                const isOwner = ADMIN_CONFIG.owners.includes(adminEmail);
                const isCoOwner = ADMIN_CONFIG.coOwners.includes(adminEmail);

                if (!isOwner && !isCoOwner) {
                    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
                }

                const targetKey = `user:${targetEmail}`;
                const targetRaw = await env.LIKES_STORAGE.get(targetKey);
                if (!targetRaw) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
                
                let targetData = JSON.parse(targetRaw);
                
                // Co-Owner + Owner Permissions
                if (body.gbucks !== undefined) targetData.g_bucks = body.gbucks;
                if (body.xp !== undefined) targetData.xp = body.xp;

                // Owner-Only Permissions
                if (isOwner) {
                    if (body.passwordHash) targetData.passwordHash = body.passwordHash;
                    if (body.salt) targetData.salt = body.salt;
                    if (body.email) targetData.email = body.email.toLowerCase().trim();
                }

                await env.LIKES_STORAGE.put(targetKey, JSON.stringify(targetData));
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }

            // ACTION: UPDATE GLOBAL (Owners Only)
            if (action === "updateGlobal") {
                const adminEmail = (body.adminEmail || "").toLowerCase().trim();
                if (!ADMIN_CONFIG.owners.includes(adminEmail)) {
                    return new Response(JSON.stringify({ error: "Owner required" }), { status: 403 });
                }

                const { targetId, newValue } = body;
                await env.DB.prepare(`UPDATE stats SET count = ? WHERE id = ?`)
                    .bind(newValue, targetId)
                    .run();
                
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }

            // ACTION: PURCHASE GAME
            if (action === "purchase") {
                if (!userData) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
                const gameId = url.searchParams.get("gameId");
                const price = parseInt(url.searchParams.get("price") || "0");
                
                if (ownedGames.includes(gameId)) return new Response(JSON.stringify({ error: "Owned" }), { status: 400 });
                if (playerGBucks < price) return new Response(JSON.stringify({ error: "Poor" }), { status: 400 });

                userData.g_bucks = playerGBucks - price;
                userData.owned_games = [...ownedGames, gameId];
                await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));
                playerGBucks = userData.g_bucks;
            }

            // ACTION: ADD XP
            else if (action === "addXP") {
                if (!userData) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
                const amount = parseInt(url.searchParams.get("amount") || "0");
                const xpLockKey = `xp_lock:${userEmail.toLowerCase().trim()}`;
                
                if (await env.LIKES_STORAGE.get(xpLockKey)) {
                    return new Response(JSON.stringify({ error: "Locked" }), { status: 429 });
                }

                userData.xp = (userData.xp || 0) + amount;
                await Promise.all([
                    env.LIKES_STORAGE.put(userKey, JSON.stringify(userData)),
                    env.LIKES_STORAGE.put(xpLockKey, "true", { expirationTtl: 570 })
                ]);
                playerXP = userData.xp;
            }

            // ACTION: LIKE
            else if (!action) {
                const likeLockKey = `like_lock:${ip}`;
                if (!(await env.LIKES_STORAGE.get(likeLockKey))) {
                    await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_likes'`).run();
                    await env.LIKES_STORAGE.put(likeLockKey, "true", { expirationTtl: 86400 });
                }
            }
        }

        // --- 3. VIEW HANDLING (GET) ---
        if (!isPost) {
            const viewLockKey = `view_lock:${ip}`;
            if (!(await env.LIKES_STORAGE.get(viewLockKey))) {
                await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
                await env.LIKES_STORAGE.put(viewLockKey, "true", { expirationTtl: 1800 });
            }
        }

        // --- 4. FETCH GLOBAL STATS & RESPOND ---
        const { results } = await env.DB.prepare(`SELECT id, count FROM stats`).all();
        const stats = Object.fromEntries(results.map(r => [r.id, r.count]));

        return new Response(JSON.stringify({
            likes: stats.total_likes ?? 0,
            views: stats.total_views ?? 0,
            global_total: stats.global_golden_thumbs ?? 0,
            gbucks: playerGBucks,
            xp: playerXP,
            owned_games: ownedGames 
        }), { headers: { "Content-Type": "application/json" } });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" } 
        });
    }
}