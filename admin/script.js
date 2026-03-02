/* NOTE: Ensure <script src="/script.js"></script> is loaded 
   BEFORE this file in your admin/index.html 
*/

let currentTargetEmail = "";

// 1. Protection & Rank Setup
document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem('user_email');
    const myRole = getRole(email);

    if (!myRole) {
        window.location.href = "/";
        return;
    }

    // Display your info
    document.getElementById('admin-email-display').innerText = email;
    document.getElementById('admin-role-badge').innerText = myRole.toUpperCase();
});

// Helper to determine numerical rank for comparison
function getRankLevel(role) {
    if (role === 'owner') return 3;
    if (role === 'co-owner') return 2;
    if (role === 'moderator') return 1;
    return 0; // Regular user
}

async function searchUser() {
    const searchEmail = document.getElementById('search-input').value.toLowerCase().trim();
    const myEmail = localStorage.getItem('user_email').toLowerCase().trim();
    
    // 1. Get Roles
    const myRole = getRole(myEmail);
    const targetRole = getRole(searchEmail);

    // 2. Fetch User Data
    const res = await fetch(`/admin/get-user?email=${encodeURIComponent(searchEmail)}`);
    const data = await res.json();

    if (data.success) {
        currentTargetEmail = searchEmail;
        document.getElementById('edit-area').style.display = 'block';
        document.getElementById('display-email').innerText = data.user.email;
        document.getElementById('input-gbucks').value = data.user.g_bucks;

        // --- PERMISSION CHECK ---
        const myLevel = getRankLevel(myRole);
        const targetLevel = getRankLevel(targetRole);

        // Rule: You can only edit people with a LOWER rank than you.
        // Exception: Owners can edit themselves/everyone.
        const canEdit = (myLevel > targetLevel) || (myRole === 'owner');

        const saveBtn = document.getElementById('save-btn');
        const inputField = document.getElementById('input-gbucks');

        if (canEdit) {
            inputField.disabled = false;
            saveBtn.disabled = false;
            saveBtn.innerText = "Save Changes";
            document.getElementById('admin-msg').innerText = "";
        } else {
            inputField.disabled = true;
            saveBtn.disabled = true;
            saveBtn.innerText = "Insufficient Rank";
            document.getElementById('admin-msg').innerText = "You cannot edit users of equal or higher rank.";
        }
    } else {
        alert("User not found");
    }
}

// 3. Save User Data
// Add this helper if it's not in your script.js
function getRole(email) {
    if (!email) return null;
    const e = email.toLowerCase().trim();
    if (ADMIN_CONFIG.owners.includes(e)) return 'owner';
    if (ADMIN_CONFIG.coOwners.includes(e)) return 'co-owner';
    if (ADMIN_CONFIG.moderators.includes(e)) return 'moderator';
    return null;
}

async function saveUserData() {
    const email = localStorage.getItem('user_email');
    const role = getRole(email);
    
    // Safety check
    if (role === 'moderator' || !role) {
        alert("Moderators cannot edit data.");
        return;
    }

    // FIX: Match the IDs used in searchUser (input-gbucks)
    const gBucksInput = document.getElementById('input-gbucks'); 
    const xpInput = document.getElementById('input-xp'); // Make sure this exists in HTML

    const updatedData = {
        targetEmail: currentTargetEmail,
        gbucks: parseInt(gBucksInput.value) || 0,
        xp: xpInput ? (parseInt(xpInput.value) || 0) : 0,
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
            msg.innerText = "Update successful!";
            msg.style.color = "lightgreen";
        } else {
            const errorData = await res.json();
            alert("Update failed: " + (errorData.error || "Check permissions."));
        }
    } catch (err) {
        console.error("Save error:", err);
        alert("Server error while saving.");
    }
}