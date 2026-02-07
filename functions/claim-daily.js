export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "No user specified" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- 1. USER CHECK (KV STORAGE) ---
    const userKey = `user:${email.toLowerCase().trim()}`;
    const userJson = await env.LIKES_STORAGE.get(userKey);

    if (!userJson) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    let userData = JSON.parse(userJson);
    const now = Date.now(); 
    const oneDay = 24 * 60 * 60 * 1000; 
    const lastClaim = userData.last_daily_claim || 0; 

    if (now - lastClaim < oneDay) {
      const hoursLeft = Math.ceil((oneDay - (now - lastClaim)) / (1000 * 60 * 60));
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Already claimed! Come back in ${hoursLeft} hours.` 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- 2. UPDATE USER REWARD (KV) ---
    userData.g_bucks = (userData.g_bucks || 0) + 1; 
    userData.last_daily_claim = now; 
    await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));

    // --- 3. UPDATE GLOBAL COUNT (D1 DATABASE) ---
    // --- 3. UPDATE GLOBAL COUNT (D1 DATABASE) ---
// 1. Update the count in the 'stats' table
await env.DB.prepare(`
  UPDATE stats 
  SET count = count + 1 
  WHERE id = 'global_golden_thumbs'
`).run();

// 2. Fetch the new total to send back to the UI
const goldenRow = await env.DB.prepare(`
  SELECT count FROM stats WHERE id = 'global_golden_thumbs'
`).first();

 newGlobalCount = goldenRow?.count || 0;

     newGlobalCount = results[0]?.global_golden_thumbs || 0;

    return new Response(JSON.stringify({
      success: true,
      new_balance: userData.g_bucks,
      global_total: newGlobalCount,
      message: "You earned 1 G-Buck!"
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}