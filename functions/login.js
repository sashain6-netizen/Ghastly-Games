export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
    }

    const userKey = `user:${email.toLowerCase().trim()}`;
    const userDataJSON = await env.LIKES_STORAGE.get(userKey);

    if (!userDataJSON) {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401 });
    }

    const userData = JSON.parse(userDataJSON);

    // --- RE-HASHING WITH STORED SALT ---
    // 1. Convert the stored Hex salt back into a Uint8Array
    const salt = new Uint8Array(userData.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    // 2. Import the login attempt password
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    // 3. Derive bits using the SAME salt and iterations as signup
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

    const attemptedHash = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');

    // 4. Compare
    if (attemptedHash === userData.passwordHash) {
      return new Response(JSON.stringify({ 
        success: true, 
        user: { email: userData.email, xp: userData.xp, g_bucks: userData.g_bucks } 
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during login." }), { status: 500 });
  }
}