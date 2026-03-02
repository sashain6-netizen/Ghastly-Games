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

    // Helper function to record logs
    async function logAction(env, admin, action, target, details) {
        try {
            await env.DB.prepare(
                `INSERT INTO admin_logs (admin_email, action_type, target, details) VALUES (?, ?, ?, ?)`
            ).bind(admin, action, target, JSON.stringify(details)).run();
        } catch (e) {
            console.error("Logging failed", e);
        }
    }

    // --- Inside your POST logic ---

    if (action === "adminUpdate") {
        // ... your existing auth checks ...

        // After the update is successful, log it:
        await logAction(env, adminEmail, "USER_UPDATE", targetEmail, {
            gbucks: body.gbucks,
            xp: body.xp
        });

        await env.LIKES_STORAGE.put(targetKey, JSON.stringify(targetData));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === "updateGlobal") {
        // ... your existing owner checks ...

        // Log the global change:
        await logAction(env, adminEmail, "GLOBAL_UPDATE", targetId, {
            newValue: newValue
        });

        await env.DB.prepare(`UPDATE stats SET count = ? WHERE id = ?`)
            .bind(newValue, targetId)
            .run();
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    try {
        // --- 1. FETCH PLAYER DATA ---
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
            const adminEmail = (body.adminEmail || "").toLowerCase().trim();

            // Permission Helpers
            const isOwner = ADMIN_CONFIG.owners.map(e => e.toLowerCase()).includes(adminEmail);
            const isCoOwner = ADMIN_CONFIG.coOwners.map(e => e.toLowerCase()).includes(adminEmail);

            // ACTION: ADMIN UPDATE (User Stats - Co-Owners & Owners)
            if (action === "adminUpdate") {
                if (!isOwner && !isCoOwner) {
                    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
                }

                const targetEmail = (body.targetEmail || "").toLowerCase().trim();
                const targetKey = `user:${targetEmail}`;
                const targetRaw = await env.LIKES_STORAGE.get(targetKey);
                
                if (!targetRaw) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
                
                let targetData = JSON.parse(targetRaw);
                
                // Both ranks can edit currency/XP
                if (body.gbucks !== undefined) targetData.g_bucks = body.gbucks;
                if (body.xp !== undefined) targetData.xp = body.xp;

                // Only Owner can edit sensitive account info
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
                if (!isOwner) {
                    return new Response(JSON.stringify({ error: "Access Denied: Owners Only" }), { 
                        status: 403,
                        headers: { "Content-Type": "application/json" }
                    });
                }

                const { targetId, newValue } = body;
                // Updates total_likes, total_views, or global_golden_thumbs
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

            // ACTION: LIKE (Increments total_likes)
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