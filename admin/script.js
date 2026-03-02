let currentTargetEmail = "";

document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem('user_email');
    if (typeof ADMIN_CONFIG === 'undefined') return;

    const myRole = getRole(email);
    if (!myRole) {
        window.location.href = "/";
        return;
    }

    document.getElementById('email-display').innerText = email;
    document.getElementById('admin-role-badge').innerText = myRole.toUpperCase();

    // Hide owner-only sections if the user is a Co-Owner or Moderator
    if (myRole !== 'owner') {
        document.querySelectorAll('.owner-only').forEach(el => el.style.display = 'none');
    }
});

function getRole(email) {
    if (!email || typeof ADMIN_CONFIG === 'undefined') return null;
    const e = email.toLowerCase().trim();
    if (ADMIN_CONFIG.owners.includes(e)) return 'owner';
    if (ADMIN_CONFIG.coOwners.includes(e)) return 'co-owner';
    if (ADMIN_CONFIG.moderators.includes(e)) return 'moderator';
    return null;
}

function getRankLevel(role) {
    if (role === 'owner') return 3;
    if (role === 'co-owner') return 2;
    if (role === 'moderator') return 1;
    return 0;
}

async function searchUser() {
    const searchInput = document.getElementById('user-search-input');
    const searchEmail = searchInput.value.toLowerCase().trim();
    const myEmail = localStorage.getItem('user_email').toLowerCase().trim();
    
    const myRole = getRole(myEmail);
    const targetRole = getRole(searchEmail);

    try {
        // CHANGE: Hit /stats because we know that URL returns JSON
        const res = await fetch(`/stats?email=${encodeURIComponent(searchEmail)}`);
        
        // Safety check: if Cloudflare sends HTML, this stops the SyntaxError crash
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            alert("Error: Server sent back a webpage instead of data. Check your URL path.");
            return;
        }

        const data = await res.json();

        // data.gbucks will be null if the user doesn't exist in KV
        if (data && data.gbucks !== null) {
            currentTargetEmail = searchEmail;
            
            document.getElementById('edit-section').style.display = 'block';
            document.getElementById('target-user-header').innerText = `Editing: ${searchEmail}`;
            
            // Mapping to your server's JSON keys: data.gbucks and data.xp
            document.getElementById('edit-gbucks').value = data.gbucks || 0;
            document.getElementById('edit-xp').value = data.xp || 0;

            const myLevel = getRankLevel(myRole);
            const targetLevel = getRankLevel(targetRole);

            const canEdit = (myLevel > targetLevel) || (myRole === 'owner');
            const saveBtn = document.getElementById('save-user-btn');

            if (canEdit) {
                saveBtn.disabled = false;
                saveBtn.innerText = "Update Account";
                document.getElementById('admin-msg').innerText = "";
            } else {
                saveBtn.disabled = true;
                saveBtn.innerText = "Insufficient Rank";
                document.getElementById('admin-msg').innerText = "You cannot edit equal or higher ranks.";
            }
        } else {
            alert("User not found in the database.");
        }
    } catch (err) {
        console.error("Search error:", err);
        alert("Failed to connect to the server.");
    }
}

async function saveUserData() {
    const email = localStorage.getItem('user_email');
    const role = getRole(email);

    const updatedData = {
        targetEmail: currentTargetEmail,
        gbucks: parseInt(document.getElementById('edit-gbucks').value) || 0,
        xp: parseInt(document.getElementById('edit-xp').value) || 0,
        adminEmail: email
    };

    try {
        const res = await fetch('/stats?action=adminUpdate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (res.ok) {
            const msg = document.getElementById('admin-msg');
            msg.innerText = "Success: Account Updated!";
            msg.style.color = "lightgreen";
        }
    } catch (err) {
        alert("Error updating user.");
    }
}

// Global variable update - LOCKED TO OWNER ONLY
async function updateGlobal(fieldId) {
    const email = localStorage.getItem('user_email');
    
    // UI Safety Check (Owner only)
    if (getRole(email) !== 'owner') {
        alert("Access Denied: Only the Owner can edit Global Stats.");
        return;
    }

    // Dynamic Input Selector: 
    // This looks for 'input-total_likes', 'input-total_views', etc.
    const valueInput = document.getElementById(`input-${fieldId}`);
    
    if (!valueInput) {
        alert(`Error: Input field 'input-${fieldId}' not found in HTML.`);
        return;
    }

    const newValue = parseInt(valueInput.value);

    if (isNaN(newValue)) {
        alert("Please enter a valid number.");
        return;
    }

    // Confirmation for accidental clicks
    if (!confirm(`Are you sure you want to set ${fieldId} to ${newValue}?`)) {
        return;
    }

    try {
        const res = await fetch('/stats?action=updateGlobal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminEmail: email,
                targetId: fieldId, // Passes 'total_likes', 'total_views', or 'global_golden_thumbs'
                newValue: newValue
            })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            alert(`${fieldId} updated successfully!`);
            // Update the display text immediately so you don't have to refresh
            const displayEl = document.getElementById(`display-${fieldId}`);
            if (displayEl) displayEl.innerText = newValue;
        } else {
            alert("Update failed: " + (data.error || "Unknown error"));
        }
    } catch (err) {
        console.error("Global update error:", err);
        alert("Server error. Check your connection.");
    }
}

async function fetchLogs() {
    // You'll need to create a new action in stats.js like ?action=getLogs
    const res = await fetch('/stats?action=getLogs');
    const logs = await res.json();
    const container = document.getElementById('log-container');
    container.innerHTML = logs.map(log => 
        `<div>[${log.timestamp}] <b>${log.admin_email}</b>: ${log.action_type} on ${log.target}</div>`
    ).join('');
}