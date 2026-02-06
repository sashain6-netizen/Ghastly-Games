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

    const userKey = `user:${email.toLowerCase().trim()}`;
    const userJson = await env.LIKES_STORAGE.get(userKey);

    if (!userJson) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    let userData = JSON.parse(userJson);

    // --- CHECK TIME LOGIC ---
    const now = Date.now(); // Current time in milliseconds
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const lastClaim = userData.last_daily_claim || 0; // Default to 0 if missing

    if (now - lastClaim < oneDay) {
      // Calculate hours left
      const hoursLeft = Math.ceil((oneDay - (now - lastClaim)) / (1000 * 60 * 60));
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Already claimed! Come back in ${hoursLeft} hours.` 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- UPDATE REWARD ---
    userData.g_bucks = (userData.g_bucks || 0) + 1; // Add 1 Buck
    userData.last_daily_claim = now; // Update timestamp

    // Save back to KV
    await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));

    return new Response(JSON.stringify({
      success: true,
      new_balance: userData.g_bucks,
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