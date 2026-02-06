export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { email, password } = await request.json();

    // --- RATE LIMITING ---
    const clientIP = request.headers.get("CF-Connecting-IP") || "anonymous";
    const limitKey = `limit:${clientIP}`;

    const hasSignedUpRecently = await env.LIKES_STORAGE.get(limitKey);
    if (hasSignedUpRecently) {
      return new Response(JSON.stringify({ 
        error: "Too many accounts. Please wait 1 hour before signing up again." 
      }), { status: 429 });
    }

    if (!email || !password || password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters." }), { status: 400 });
    }

    const userKey = `user:${email.toLowerCase().trim()}`;

    const existingUser = await env.LIKES_STORAGE.get(userKey);
    if (existingUser) {
      return new Response(JSON.stringify({ error: "An account with this email already exists." }), { status: 409 });
    }

    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // --- FIX IS HERE (ADDED COMMAS) ---
    const userData = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      created_at: new Date().toISOString(),
      xp: 0,              // Comma added
      g_bucks: 0,         // Comma added
      last_daily_claim: 0
    };

    // Save the User
    await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));

    // START THE CLOCK (1 Hour Lockout)
    await env.LIKES_STORAGE.put(limitKey, "true", { expirationTtl: 3600 });

    return new Response(JSON.stringify({ success: true, message: "Account created!" }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during signup." }), { status: 500 });
  }
}