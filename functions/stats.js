export async function onRequest(context) {
  const { request, env } = context;
  
  // 1. Determine which stat we are updating
  // POST = Like button clicked, GET = Page loaded (view)
  const isLike = request.method === "POST";
  const targetId = isLike ? "total_likes" : "total_views";
  const otherId = isLike ? "total_views" : "total_likes";

  try {
    // 2. Atomic Update: Increment the count and get the NEW value back immediately
    const updatedRow = await env.DB.prepare(`
      UPDATE stats 
      SET count = count + 1 
      WHERE id = ? 
      RETURNING count
    `).bind(targetId).first();

    // 3. Fetch the other stat so we can return both to the frontend
    const otherRow = await env.DB.prepare(`
      SELECT count FROM stats WHERE id = ?
    `).bind(otherId).first();

    // 4. Organize the data for the response
    const data = {
      likes: isLike ? updatedRow.count : otherRow.count,
      views: isLike ? otherRow.count : updatedRow.count
    };

    return new Response(JSON.stringify(data), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
