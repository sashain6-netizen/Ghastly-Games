// /functions/admin/_middleware.js

const STAFF = {
    owners: ['sashain6@gmail.com'],
    coOwners: ['coowner@example.com'],
    moderators: ['mod1@example.com']
};

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    // In a real app, you'd check a Secure Cookie/Session.
    // Since you are using localStorage/Email params, we check the query:
    const email = url.searchParams.get("adminEmail")?.toLowerCase().trim();

    const isOwner = STAFF.owners.includes(email);
    const isCoOwner = STAFF.coOwners.includes(email);
    const isMod = STAFF.moderators.includes(email);

    if (!isOwner && !isCoOwner && !isMod) {
        return new Response("Unauthorized", { status: 403 });
    }

    // If they are a moderator and trying to perform a POST/PUT/DELETE (edit)
    if (isMod && (request.method === "POST" || request.method === "PUT")) {
        return new Response("Moderators cannot edit data", { status: 403 });
    }

    return await context.next();
}