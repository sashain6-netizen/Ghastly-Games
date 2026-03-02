let currentTargetEmail = "";

document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem('user_email');
    if (typeof ADMIN_CONFIG === 'undefined') return;

    const myRole = getRole(email);
    if (!myRole) {
        window.location.href = "/";
        return;
    }

    document.getElementById('admin-email-display').innerText = email;
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
    // MATCHING HTML ID: user-search-input
    const searchInput = document.getElementById('user-search-input');
    const searchEmail = searchInput.value.toLowerCase().trim();
    const myEmail = localStorage.getItem('user_email').toLowerCase().trim();
    
    const myRole = getRole(myEmail);
    const targetRole = getRole(searchEmail);

    try {
        const res = await fetch(`/admin/get-user?email=${encodeURIComponent(searchEmail)}`);
        const data = await res.json();

        if (data.success) {
            currentTargetEmail = searchEmail;
            
            // MATCHING HTML IDs
            document.getElementById('edit-section').style.display = 'block';
            document.getElementById('target-user-header').innerText = `Editing: ${data.user.email}`;
            document.getElementById('edit-gbucks').value = data.user.g_bucks || 0;
            document.getElementById('edit-xp').value = data.user.xp || 0;

            const myLevel = getRankLevel(myRole);
            const targetLevel = getRankLevel(targetRole);

            // Hierarchy Rule: Only edit lower ranks (Owners edit all)
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
            alert("User not found");
        }
    } catch (err) {
        console.error(err);
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
    
    // UI Safety Check
    if (getRole(email) !== 'owner') {
        alert("Access Denied: Only Owners can edit Global Variables.");
        return;
    }

    const valueInput = document.getElementById('global-thumbs');
    const newValue = parseInt(valueInput.value);

    if (isNaN(newValue)) {
        alert("Please enter a valid number.");
        return;
    }

    try {
        const res = await fetch('/stats?action=updateGlobal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminEmail: email,
                targetId: fieldId, // This passes 'global_golden_thumbs' to the DB query
                newValue: newValue
            })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            alert("Global variables updated successfully!");
            // Optional: Refresh the page or update the UI to show the new value
        } else {
            alert("Update failed: " + (data.error || "Unknown error"));
        }
    } catch (err) {
        console.error("Global update error:", err);
        alert("Server error. Check your connection.");
    }
}