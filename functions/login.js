export async function onRequest(context) {
  const { request, env } = context;

  const headers = { "Content-Type": "application/json" };

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400, headers });
    }

    const userKey = `user:${email.toLowerCase().trim()}`;
    const userDataJSON = await env.LIKES_STORAGE.get(userKey);

    if (!userDataJSON) {
      // Use generic error to prevent email enumeration
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401, headers });
    }

    const userData = JSON.parse(userDataJSON);

    // 1. Convert Hex salt to Uint8Array
    const salt = new Uint8Array(userData.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    // 2. Import the login attempt password
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    // 3. Derive bits (Ensure iterations match your signup code!)
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      256
    );

    const attemptedHash = Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // 4. Compare (Strict equality)
    if (attemptedHash === userData.passwordHash) {
      return new Response(JSON.stringify({ 
        success: true, 
        user: { email: userData.email, xp: userData.xp, g_bucks: userData.g_bucks } 
      }), { status: 200, headers });
    } else {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401, headers });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during login." }), { status: 500, headers });
  }
}