export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { email, password } = await request.json();
    
    // 1. Clean and Validate Input
    if (!email || typeof email !== 'string' || !password || password.length < 8) {
      return new Response(JSON.stringify({ error: "Invalid email or password (min 8 chars)." }), { status: 400 });
    }

    const emailKey = email.toLowerCase().trim();
    const limitKey = `limit_v2:${emailKey}`;
    const userKey = `user:${emailKey}`;

    // 2. Rate limiting & Existence Check (Parallelize for speed)
    const [hasSignedUpRecently, existingUser] = await Promise.all([
      env.LIKES_STORAGE.get(limitKey),
      env.LIKES_STORAGE.get(userKey)
    ]);

    if (hasSignedUpRecently) {
      return new Response(JSON.stringify({ error: "Please wait a minute before trying again." }), { status: 429 });
    }

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Account already exists." }), { status: 409 });
    }

    // 3. Salting & Hashing
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    
    const baseKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

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

    // Efficient Hex Conversion
    const toHex = (buf) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const userData = {
      email: emailKey,
      passwordHash: toHex(derivedBits),
      salt: toHex(salt),
      created_at: new Date().toISOString(),
      xp: 0,
      g_bucks: 0,
      owned_games: []
    };

    // 4. Persistence
    await Promise.all([
      env.LIKES_STORAGE.put(userKey, JSON.stringify(userData)),
      env.LIKES_STORAGE.put(limitKey, "true", { expirationTtl: 60 })
    ]);

    return new Response(JSON.stringify({ success: true, message: "Account created!" }), { status: 201 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error during signup." }), { status: 500 });
  }
}