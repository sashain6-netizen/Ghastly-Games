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

    // --- UPDATED LOGIC: RATE LIMITING BY EMAIL ---
// We use the email to create a unique key for the rate limit
const emailKey = email.toLowerCase().trim();
const limitKey = `limit_v2:${emailKey}`;

// Check if THIS specific email has tried to sign up in the last minute
const hasSignedUpRecently = await env.LIKES_STORAGE.get(limitKey);
if (hasSignedUpRecently) {
  return new Response(JSON.stringify({ 
    error: "Please wait a moment before trying to register this email again." 
  }), { status: 429 });
}
// --- END UPDATED LOGIC ---

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

    const userData = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      created_at: new Date().toISOString(),
      xp: 0
    };

    // Save the User
    await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));

    await env.LIKES_STORAGE.put(limitKey, "true", { expirationTtl: 3600 });

    return new Response(JSON.stringify({ success: true, message: "Account created!" }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during signup." }), { status: 500 });
  }
}