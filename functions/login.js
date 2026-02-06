export async function onRequest(context) {
  const { request, env } = context;

  // 1. Only allow POST requests for logging in
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });
    }

    // 2. Look up the user in your likes_db KV using the "user:" prefix
    const userKey = `user:${email.toLowerCase().trim()}`;
    const userDataJSON = await env.LIKES_STORAGE.get(userKey);

    if (!userDataJSON) {
      return new Response(JSON.stringify({ error: "User not found. Please sign up first." }), { status: 404 });
    }

    const userData = JSON.parse(userDataJSON);

    // 3. Re-hash the "attempted" password to see if it matches the stored one
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const attemptedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 4. Compare the hashes
    if (attemptedHash === userData.password) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Logged in!",
        g_bucks: userData.g_bucks || 0 
      }), { ... });
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Login successful!",
        user: { 
          email: userData.email, 
          xp: userData.xp || 0 
        } 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Incorrect password." }), { status: 401 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during login." }), { status: 500 });
  }
}