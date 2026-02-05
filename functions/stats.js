export async function onRequest(context) {
  const { request, env } = context;
  
  // 1. Define our keys in the KV database
  const LIKE_KEY = "total_likes";
  const VIEW_KEY = "total_views";

  // 2. Get current values (default to 0 if they don't exist yet)
  let likes = parseInt(await env.LIKES_STORAGE.get(LIKE_KEY)) || 0;
  let views = parseInt(await env.LIKES_STORAGE.get(VIEW_KEY)) || 0;

  // 3. Logic: 
  // If the request is a POST (someone clicked the button), increase likes.
  // If the request is a GET (page load), increase views.
  if (request.method === "POST") {
    likes += 1;
    await env.LIKES_STORAGE.put(LIKE_KEY, likes.toString());
  } else {
    views += 1;
    await env.LIKES_STORAGE.put(VIEW_KEY, views.toString());
  }

  // 4. Return both numbers to your HTML
  return new Response(JSON.stringify({ 
    likes: likes, 
    views: views 
  }), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" 
    },
  });
}
