// /functions/admin/_middleware.js

const STAFF = {
    owners: ['sashain6@gmail.com'],
    coOwners: ['568712@my.cuhsd.org'],
    moderators: ['568974@my.cuhsd.org']
};

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    
    // 1. Identify the Admin
    // We check both searchParams (for GET) and the body (for POST)
    let adminEmail = url.searchParams.get("adminEmail")?.toLowerCase().trim();
    
    // 2. Clone the request to look at the body if it's a POST
    let body = {};
    if (request.method === "POST") {
        const clonedRequest = request.clone();
        try {
            body = await clonedRequest.json();
            adminEmail = adminEmail || body.adminEmail?.toLowerCase().trim();
        } catch (e) { /* Not JSON or empty body */ }
    }

    const isOwner = STAFF.owners.includes(adminEmail);
    const isCoOwner = STAFF.coOwners.includes(adminEmail);
    const isMod = STAFF.moderators.includes(adminEmail);

    // 3. HARD BLOCK: Not on the list
    if (!isOwner && !isCoOwner && !isMod) {
        return new Response("Unauthorized: Not a staff member.", { status: 403 });
    }

    // 4. ROLE-BASED PERMISSIONS
    if (request.method === "POST" || request.method === "PUT") {
        
        // Block Moderators from all edits
        if (isMod) {
            return new Response("Forbidden: Moderators have Read-Only access.", { status: 403 });
        }

        // Block Co-Owners from Hashing/Salting
        // Even if they "fake" the UI, the server sees these keys and rejects them
        const sensitiveFields = ['password_hash', 'salt', 'edit-hash', 'edit-salt'];
        const attemptingSensitiveChange = sensitiveFields.some(field => body[field] !== undefined);

        if (attemptingSensitiveChange && !isOwner) {
            return new Response("Forbidden: Only the Owner can modify security hashes.", { status: 403 });
        }
    }

    return await context.next();
}