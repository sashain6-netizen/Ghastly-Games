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

    const emailKey = email.toLowerCase().trim();
    const userKey = `user:${emailKey}`;
    
    // 1. Fetch user data from KV
    const userDataJSON = await env.LIKES_STORAGE.get(userKey);
    if (!userDataJSON) {
      // Use a generic error to prevent "Email Enumeration" (telling hackers which emails exist)
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401, headers });
    }

    const userData = JSON.parse(userDataJSON);

    // 2. Convert the stored Hex salt back into a Uint8Array
    // This reverses the .map(b => b.toString(16)) logic from your signup
    const salt = new Uint8Array(userData.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    // 3. Import the login attempt password as raw key material
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    // 4. Derive bits using the EXACT SAME parameters as signup
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000, // Must match signup exactly
        hash: "SHA-256",    // Must match signup exactly
      },
      baseKey,
      256
    );

    // 5. Convert the result to Hex to compare with the stored hash
    const attemptedHash = Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // 6. Final Comparison
    if (attemptedHash === userData.passwordHash) {
      // Success! Return user profile data (minus the sensitive stuff)
      return new Response(JSON.stringify({ 
        success: true, 
        user: { 
          email: userData.email, 
          xp: userData.xp, 
          g_bucks: userData.g_bucks,
          owned_games: userData.owned_games
        } 
      }), { status: 200, headers });
    } else {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401, headers });
    }

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error during login." }), { status: 500, headers });
  }
}