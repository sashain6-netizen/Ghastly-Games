export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { email, password } = await request.json();
    const emailKey = email.toLowerCase().trim();
    const limitKey = `limit_v2:${emailKey}`;

    // Rate limiting check
    const hasSignedUpRecently = await env.LIKES_STORAGE.get(limitKey);
    if (hasSignedUpRecently) {
      return new Response(JSON.stringify({ error: "Please wait before trying again." }), { status: 429 });
    }

    if (!email || !password || password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters." }), { status: 400 });
    }

    const userKey = `user:${emailKey}`;
    const existingUser = await env.LIKES_STORAGE.get(userKey);
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Account already exists." }), { status: 409 });
    }

    // --- SALTING & HASHING LOGIC ---
    // 1. Generate a unique random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // 2. Import the password as a key material
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    // 3. Derive the hash using PBKDF2 (Slower and more secure than plain SHA-256)
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000, // Number of times to hash
        hash: "SHA-256",
      },
      baseKey,
      256 // Length of the resulting hash in bits
    );

    // 4. Convert salt and hash to Hex strings for storage
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');

    const userData = {
      email: emailKey,
      passwordHash: hashHex,
      salt: saltHex, // WE MUST STORE THE SALT
      created_at: new Date().toISOString(),
      xp: 0,
      g_bucks: 0,
      owned_games: []
    };

    await env.LIKES_STORAGE.put(userKey, JSON.stringify(userData));
    await env.LIKES_STORAGE.put(limitKey, "true", { expirationTtl: 60 });

    return new Response(JSON.stringify({ success: true, message: "Account created!" }), { status: 201 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during signup." }), { status: 500 });
  }
}