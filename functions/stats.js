const ADMIN_CONFIG = {
    owners: ['sashain6@gmail.com'],
    coOwners: ['568712@my.cuhsd.org', 'anthonythegoat779@gmail.com'],
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

    // Helper function to record logs safely
    async function logAction(env, admin, actionType, target, details) {
        try {
            if (env.DB) {
                await env.DB.prepare(
                    `INSERT INTO admin_logs (admin_email, action_type, target, details) VALUES (?, ?, ?, ?)`
                ).bind(admin, actionType, target, JSON.stringify(details)).run();
            }
        } catch (e) {
            console.error("Logging failed:", e.message);
        }
    }

    try {
        // --- 1. FETCH PLAYER DATA (For GET and general POST) ---
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

        // --- 2. POST LOGIC ---
        if (isPost) {
            const body = await request.json().catch(() => ({}));
            const adminEmail = (body.adminEmail || "").toLowerCase().trim();

            // Permission Helpers
            const isOwner = ADMIN_CONFIG.owners.map(e => e.toLowerCase()).includes(adminEmail);
            const isCoOwner = ADMIN_CONFIG.coOwners.map(e => e.toLowerCase()).includes(adminEmail);

            // ACTION: ADMIN UPDATE (User Stats)
            if (action === "adminUpdate") {
                if (!isOwner && !isCoOwner) {
                    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
                }

                const targetEmail = (body.targetEmail || "").toLowerCase().trim();
                const targetKey = `user:${targetEmail}`;
                const targetRaw = await env.LIKES_STORAGE.get(targetKey);
                
                if (!targetRaw) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
                
                let targetData = JSON.parse(targetRaw);
                
                if (body.gbucks !== undefined) targetData.g_bucks = body.gbucks;
                if (body.xp !== undefined) targetData.xp = body.xp;

                if (isOwner) {
                    if (body.passwordHash) targetData.passwordHash = body.passwordHash;
                    if (body.salt) targetData.salt = body.salt;
                }

                // LOG AND SAVE
                await logAction(env, adminEmail, "USER_UPDATE", targetEmail, { gbucks: body.gbucks, xp: body.xp });
                await env.LIKES_STORAGE.put(targetKey, JSON.stringify(targetData));
                
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }

            // ACTION: UPDATE GLOBAL (Owners Only)
            if (action === "updateGlobal") {
                if (!isOwner) return new Response(JSON.stringify({ error: "Owners Only" }), { status: 403 });

                const { targetId, newValue } = body;
                
                await logAction(env, adminEmail, "GLOBAL_UPDATE", targetId, { newValue });
                
                await env.DB.prepare(`UPDATE stats SET count = ? WHERE id = ?`)
                    .bind(newValue, targetId)
                    .run();
                
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }

            // ACTION: PURCHASE / ADD XP (Standard User Actions)
            if (action === "purchase") {
                if (!userData) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
                const gameId = url.searchParams.get("gameId");
                const price = parseInt(url.searchParams.get("price") || "0");
                if (ownedGames.includes(gameId)) return new Response(JSON.stringify({ error: "Owned" }), { status: 400 });
                if (playerGBucks < price) return new Response(JSON.stringify({ error: "Insufficient Funds" }), { status: 400 });

                userData.g_bucks = playerGBucks - price;
                userData.owned_games = [...ownedGames, gameId];
                await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));
                playerGBucks = userData.g_bucks;
            } 
            else if (action === "addXP") {
                if (!userData) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
                const amount = parseInt(url.searchParams.get("amount") || "0");
                userData.xp = (userData.xp || 0) + amount;
                await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));
                playerXP = userData.xp;
            }
        }

        // --- 3. FETCH LOGS (Special Case for Admin View) ---
        if (!isPost && action === "getLogs") {
            const checkEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
            if (!ADMIN_CONFIG.owners.map(e => e.toLowerCase()).includes(checkEmail)) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
            }
            const { results } = await env.DB.prepare(`SELECT * FROM admin_logs ORDER BY timestamp DESC LIMIT 50`).all();
            return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
        }

        // --- 4. VIEW HANDLING & STATS FETCH ---
        if (!isPost) {
            const viewLockKey = `view_lock:${ip}`;
            if (!(await env.LIKES_STORAGE.get(viewLockKey))) {
                await env.DB.prepare(`UPDATE stats SET count = count + 1 WHERE id = 'total_views'`).run();
                await env.LIKES_STORAGE.put(viewLockKey, "true", { expirationTtl: 1800 });
            }
        }

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