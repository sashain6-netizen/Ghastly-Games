export async function onRequest(context) {
  const { request, env } = context;
  const key = "total_likes";

  // 1. Get the current count from your KV database
  let count = await env.LIKES_STORAGE.get(key);
  count = count ? parseInt(count) : 0;

  // 2. If the button was clicked (POST), add 1
  if (request.method === "POST") {
    count += 1;
    await env.LIKES_STORAGE.put(key, count.toString());
  }

  // 3. Send the number back to the HTML page
  return new Response(JSON.stringify({ likes: count }), {
    headers: { "Content-Type": "application/json" },
  });
}
