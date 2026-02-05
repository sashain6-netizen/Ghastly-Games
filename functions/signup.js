export async function onRequest(context) {
  const { request, env } = context;

  // 1. Only allow POST requests
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { email, password } = await request.json();

    // Basic Validation
    if (!email || !password || password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters." }), { status: 400 });
    }

    // We use a prefix "user:" so we don't mix up accounts with your "total_likes" key
    const userKey = `user:${email.toLowerCase().trim()}`;

    // 2. Check if the user already exists
    const existingUser = await env.LIKES_STORAGE.get(userKey);
    if (existingUser) {
      return new Response(JSON.stringify({ error: "An account with this email already exists." }), { status: 409 });
    }

    // 3. Hash the password (Web Crypto API)
    // We hash it so that plain-text passwords are never stored in your KV
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 4. Create the User Object
    const userData = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      created_at: new Date().toISOString(),
      xp: 0 // Optional: starting stats for your games!
    };

    // 5. Save to your KV (likes_db)
    await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));

    return new Response(JSON.stringify({ success: true, message: "Account created!" }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during signup." }), { status: 500 });
  }
}