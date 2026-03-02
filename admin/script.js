const ADMIN_CONFIG = {
    owners: ['sashain6@gmail.com'],
    coOwners: ['coowner@example.com'],
    moderators: ['mod1@example.com']
};

let currentTargetEmail = "";

// 1. Protection & Rank Setup
document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem('user_email');
    const role = getRole(email);

    if (!role) {
        window.location.href = "/";
        return;
    }

    document.getElementById('admin-email-display').innerText = email;
    document.getElementById('admin-role-badge').innerText = role.toUpperCase();

    // Hide Owner-Only features from Mods and Co-Owners
    if (role !== 'owner') {
        document.querySelectorAll('.owner-only').forEach(el => el.style.display = 'none');
    }

    // Disable all saving if Moderator
    if (role === 'moderator') {
        document.querySelectorAll('input, .save-btn, .small-save').forEach(el => el.disabled = true);
        document.getElementById('admin-msg').innerText = "Read-Only Mode: Moderators cannot save changes.";
    }
});

function getRole(email) {
    if (!email) return null;
    const e = email.toLowerCase().trim();
    if (ADMIN_CONFIG.owners.includes(e)) return 'owner';
    if (ADMIN_CONFIG.coOwners.includes(e)) return 'co-owner';
    if (ADMIN_CONFIG.moderators.includes(e)) return 'moderator';
    return null;
}

// 2. Fetch User Data
async function searchUser() {
    const searchEmail = document.getElementById('user-search-input').value.toLowerCase().trim();
    if (!searchEmail) return;

    try {
        // We call your existing stats endpoint but as a GET to view data
        const res = await fetch(`/stats?email=${encodeURIComponent(searchEmail)}`);
        const data = await res.json();

        if (data.error) {
            alert("User not found or error fetching.");
            return;
        }

        currentTargetEmail = searchEmail;
        document.getElementById('edit-section').style.display = 'block';
        document.getElementById('target-user-header').innerText = `Editing: ${searchEmail}`;
        
        // Fill fields
        document.getElementById('edit-gbucks').value = data.gbucks || 0;
        document.getElementById('edit-xp').value = data.xp || 0;
        
        // Owner fields (if they exist in your DB response)
        if(data.passwordHash) document.getElementById('edit-hash').value = data.passwordHash;
        if(data.salt) document.getElementById('edit-salt').value = data.salt;

    } catch (err) {
        console.error("Fetch failed", err);
    }
}

// 3. Save User Data
async function saveUserData() {
    const email = localStorage.getItem('user_email');
    const role = getRole(email);
    
    if (role === 'moderator') return;

    const updatedData = {
        targetEmail: currentTargetEmail,
        gbucks: parseInt(document.getElementById('edit-gbucks').value),
        xp: parseInt(document.getElementById('edit-xp').value),
        adminEmail: email // Verification for middleware
    };

    const res = await fetch('/stats?action=adminUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    if (res.ok) {
        document.getElementById('admin-msg').innerText = "Update successful!";
        document.getElementById('admin-msg').style.color = "lightgreen";
    } else {
        alert("Update failed. Check permissions.");
    }
}