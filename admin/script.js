let currentTargetEmail = "";

// --- 1. UTILITIES ---

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

// --- 2. USER MANAGEMENT ---

async function searchUser() {
    const searchInput = document.getElementById('user-search-input');
    const searchEmail = searchInput.value.toLowerCase().trim();
    const myEmail = (localStorage.getItem('user_email') || "").toLowerCase().trim();
    
    if (!searchEmail) return alert("Please enter an email.");

    const myRole = getRole(myEmail);
    const targetRole = getRole(searchEmail);

    try {
        const res = await fetch(`/stats?email=${encodeURIComponent(searchEmail)}`);
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            alert("Error: Server sent back a webpage instead of data. Check your URL path.");
            return;
        }

        const data = await res.json();

        if (data && data.gbucks !== null) {
        currentTargetEmail = searchEmail;
        
        document.getElementById('edit-section').style.display = 'block';
        document.getElementById('target-user-header').innerText = `Editing: ${searchEmail}`;
        
        // Fill basic fields
        document.getElementById('edit-gbucks').value = data.gbucks || 0;
        document.getElementById('edit-xp').value = data.xp || 0;

       // --- THE CLEAN REVEAL ---
        const ownerFields = document.querySelectorAll('.owner-only');
        
        if (myRole === 'owner') {
            ownerFields.forEach(el => {
                el.style.display = 'flex'; // Ensures it shows up
                el.classList.add('show-field'); // Ensures it gets your flex-column styling
            });
            
            // Map the data from the server
            document.getElementById('edit-hash').value = data.password_hash || "";
            document.getElementById('edit-salt').value = data.salt || "";
        } else {
            ownerFields.forEach(el => {
                el.style.display = 'none';
                el.classList.remove('show-field');
            });
        }

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
        alert("User not found.");
    }
    } catch (err) {
        alert("Error searching for user.");
    }
}

async function saveUserData() {
    const email = localStorage.getItem('user_email');
    const myRole = getRole(email); // Get your role again to check permissions
    const msg = document.getElementById('admin-msg');

    const updatedData = {
        targetEmail: currentTargetEmail,
        gbucks: parseInt(document.getElementById('edit-gbucks').value) || 0,
        xp: parseInt(document.getElementById('edit-xp').value) || 0,
        adminEmail: email
    };

    // --- THE FIX FOR SAVING HASH/SALT ---
    // Only send these if you are the owner
    if (myRole === 'owner') {
        updatedData.password_hash = document.getElementById('edit-hash').value;
        updatedData.salt = document.getElementById('edit-salt').value;
    }
    // ------------------------------------

    try {
        const res = await fetch('/stats?action=adminUpdate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (res.ok) {
            msg.innerText = "Success: Account Updated!";
            msg.style.color = "lightgreen";
        } else {
            const errData = await res.json();
            msg.innerText = "Error: " + (errData.error || "Update failed");
            msg.style.color = "red";
        }
    } catch (err) {
        alert("Error updating user.");
    }
}

// --- 3. GLOBAL STATS (OWNER ONLY) ---

async function updateGlobal(fieldId) {
    const email = localStorage.getItem('user_email');
    
    if (getRole(email) !== 'owner') {
        alert("Access Denied: Only the Owner can edit Global Stats.");
        return;
    }

    const valueInput = document.getElementById(`input-${fieldId}`);
    if (!valueInput) return alert(`Input field 'input-${fieldId}' not found.`);

    const newValue = parseInt(valueInput.value);
    if (isNaN(newValue)) return alert("Please enter a valid number.");

    if (!confirm(`Are you sure you want to set ${fieldId} to ${newValue}?`)) return;

    try {
        const res = await fetch('/stats?action=updateGlobal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminEmail: email,
                targetId: fieldId,
                newValue: newValue
            })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            alert(`${fieldId} updated successfully!`);
            const displayEl = document.getElementById(`display-${fieldId}`);
            if (displayEl) displayEl.innerText = newValue;
        } else {
            alert("Update failed: " + (data.error || "Unknown error"));
        }
    } catch (err) {
        console.error("Global update error:", err);
        alert("Server error.");
    }
}

// --- 4. LOGS ---

async function fetchLogs() {
    const container = document.getElementById('log-container');
    if (!container) return;
    const email = localStorage.getItem('user_email');

    try {
        const res = await fetch(`/stats?action=getLogs&email=${email}`);
        const data = await res.json();
        
        if (!Array.isArray(data)) {
            container.innerHTML = `<div style="color:red">Error: ${data.error || "Cannot load logs"}</div>`;
            return;
        }

        container.innerHTML = data.map(log => 
            `<div class="log-entry">[${new Date(log.timestamp).toLocaleString()}] <b>${log.admin_email}</b>: ${log.action_type} on ${log.target}</div>`
        ).join('');
    } catch (err) {
        container.innerHTML = "Failed to fetch logs";
    }
}

// --- 5. INITIALIZATION (The fix for line 13/3) ---

document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem('user_email') || "";
    const role = getRole(email);
    
    // 1. Update Header Displays
    const display = document.getElementById('admin-email-display');
    if (display) display.innerText = email || "Not Logged In";

    const badge = document.getElementById('admin-role-badge');
    if (badge) badge.innerText = role ? role.toUpperCase() : "GUEST";

    // 2. IMMEDIATE REVEAL FOR OWNER
    if (role === 'owner') {
        const ownerFields = document.querySelectorAll('.owner-only');
        ownerFields.forEach(el => {
            // This forces them to be visible even before a search happens
            el.style.setProperty('display', 'flex', 'important');
        });
        
        // Auto-load logs if owne
        fetchLogs();
    }
});