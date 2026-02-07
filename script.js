const sites = [
    { name: "GameZone", url: "/games/" },
    { name: "Selenite", url: "https://development.churchinhuntsville.org" },
    { name: "Six Seven Games", url: "https://sixsevengames.pages.dev" },
    { name: "Duck Math", url: "https://ajdhbajhdsbashjbdhbawkjdbuyabidughauygediugweg8aw648676217.pages.dev" },
    { name: "Overcloaked", url: "https://room-32-toys.woodcraftgallery.com.np" },
    { name: "Nettleweb", url: "https://nettlewebiduha.pages.dev" },
    { name: "Watch Documentaries", url: "https://watchdocumentaries.com/games/" },
    { name: "Sigma Games", url: "http://kyeeldergroebe.us/" },
    { name: "Emupedia", url: "https://emupedia.net/beta/" },
    { name: "Ultimate Games", url: "https://media1.tenor.com/m/XbvDHnhj_YQAAAAd/bro-just-typing-shit-atm.gif" },
    { name: "Cool Math Games", url: "https://www.coolmathgames.com/" },
    { name: "Edugames", url: "https://edugames33.wixsite.com/edugames/games5" },
    { name: "Youtube Video Unblocker", url: "https://clipwise.com/" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
];

const grid = document.getElementById('link-grid');

sites.forEach(site => {
    const card = document.createElement('a');
    card.href = site.url;
    card.target = "_blank";
    card.className = 'link-card';
    card.innerHTML = `<span>${site.name}</span>`;
    grid.appendChild(card);
});

function showGameModal(title, message) {
    const overlay = document.getElementById('game-modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const msgEl = document.getElementById('modal-message');

    if (overlay && titleEl && msgEl) {
        titleEl.innerText = title;
        msgEl.innerText = message;
        overlay.style.display = 'flex'; 
    } else {
        // Fallback if your HTML doesn't have the modal elements yet
        alert(title + ": " + message);
    }
}

function closeGameModal() {
    const overlay = document.getElementById('game-modal-overlay');
    if (overlay) overlay.style.display = 'none';
}

function showAdRandomly() {
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');
    if (!adPopup || !adImage) return;

    const adFiles = ["games/ads/ad1.png", "games/ads/ad2.png", "games/ads/ad3.png", "games/ads/ad4.png", "games/ads/ad5.png", "games/ads/ad6.png", "games/ads/ad7.png", "games/ads/ad8.png", "games/ads/ad9.png", "games/ads/ad10.png", "games/ads/ad11.png", "games/ads/ad12.png", "games/ads/ad13.png", "games/ads/ad14.png", "games/ads/ad15.png", "games/ads/ad16.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    adPopup.style.top = 'auto'; adPopup.style.bottom = 'auto'; adPopup.style.left = 'auto'; adPopup.style.right = 'auto';
    adPopup.classList.remove('slide-in-top', 'slide-in-bottom', 'slide-in-left', 'slide-in-right');

    const adWidth = 300; const adHeight = 200; 
    const maxLeft = window.innerWidth - adWidth;
    const maxTop = window.innerHeight - adHeight;
    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) { adPopup.style.top = '30px'; adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px'; adPopup.classList.add('slide-in-top'); } 
    else if (edge === 1) { adPopup.style.right = '30px'; adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px'; adPopup.classList.add('slide-in-right'); } 
    else if (edge === 2) { adPopup.style.bottom = '30px'; adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px'; adPopup.classList.add('slide-in-bottom'); } 
    else { adPopup.style.left = '30px'; adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px'; adPopup.classList.add('slide-in-left'); }

    adPopup.style.display = 'block';
}

function closeAd() {
    const adPopup = document.getElementById('adPopup');
    if (adPopup) {
        adPopup.style.display = 'none';
        setTimeout(showAdRandomly, 60000);
    }
}

// ==========================================
// MENU SYSTEM
// ==========================================

const creditsButton = document.getElementById('credits-button');
const creditsMenu = document.getElementById('credits-menu');
const logsButton = document.getElementById('logs-button');
const logsMenu = document.getElementById('logs-menu');
const infoButton = document.getElementById('info-button');
const infoMenu = document.getElementById('info-menu');

function closeAllMenus() {
    if (creditsMenu) creditsMenu.style.display = 'none';
    if (logsMenu) logsMenu.style.display = 'none';
    if (infoMenu) infoMenu.style.display = 'none';
}

[creditsButton, logsButton, infoButton].forEach((btn, idx) => {
    const menus = [creditsMenu, logsMenu, infoMenu];
    if (btn && menus[idx]) {
        btn.addEventListener('click', () => {
            const isClosed = menus[idx].style.display === 'none';
            closeAllMenus();
            if (isClosed) menus[idx].style.display = 'block';
        });
    }
});

// --- STATS SYNC LOGIC ---

async function updateStats(isClick = false) {
    const likeDisplay = document.getElementById('likes'); 
    const viewDisplay = document.getElementById('views');
    const goldenCountSpan = document.getElementById('golden-count');
    const gBucksSpan = document.getElementById('g-bucks'); 
    const likeBtn = document.getElementById('like-btn');

    // Show cached balance immediately
    const cachedBalance = localStorage.getItem('golden_balance');
    if (cachedBalance !== null && gBucksSpan) {
        gBucksSpan.innerText = cachedBalance;
    }

    try {
        const email = localStorage.getItem('user_email') || ""; 
        // If no one is logged in, reset the G-Bucks display immediately
        if (!email && gBucksSpan) {
            gBucksSpan.innerText = "0";
        }
        const method = isClick ? 'POST' : 'GET';
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}`, { method });
        if (!res.ok) return; 

        const data = await res.json();

        if (likeDisplay) likeDisplay.innerText = data.likes ?? "0";
        if (viewDisplay) viewDisplay.innerText = data.views ?? "0";
        if (goldenCountSpan) goldenCountSpan.innerText = data.global_total ?? "0";
        
        if (gBucksSpan && data.gbucks !== null) {
            gBucksSpan.innerText = data.gbucks;
            localStorage.setItem('golden_balance', data.gbucks);
        }

        if (likeBtn) {
            if (isClick || localStorage.getItem('hasLiked') === 'true') {
                likeBtn.disabled = true;
                likeBtn.style.opacity = "0.7";
                likeBtn.innerHTML = `👍 Liked | <span id="likes">${data.likes}</span>`;
                if (isClick) localStorage.setItem('hasLiked', 'true');
            }
        }
    } catch (err) {
        console.error("Sync failed:", err);
    }
}

// ==========================================
// ACCOUNT, LOGIN & REWARD LOGIC
// ==========================================

function openAuth(type) {
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'none';
    resetForm();
    document.getElementById(type === 'signup' ? 'signup-form-container' : 'login-form-container').style.display = 'block';
}

function closeAuth(event) {
    if (event && event.target !== document.getElementById('auth-overlay')) return;
    document.getElementById('auth-overlay').style.display = 'none';
}

function resetForm() {
    ['reg-email', 'reg-password', 'login-email', 'login-password'].forEach(id => document.getElementById(id).value = '');
    ['signup-msg', 'login-msg'].forEach(id => document.getElementById(id).innerText = '');
}

async function handleSignup() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const messageBox = document.getElementById('signup-msg');

    // 1. Email Validation (Check for @ and then a .)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageBox.innerText = "Invalid email. Must contain @ and a dot (e.g., user@site.com)";
        messageBox.style.color = "red";
        return;
    }

    // 2. Password Validation (At least 8 characters)
    if (password.length < 8) {
        messageBox.innerText = "Password must be at least 8 characters long.";
        messageBox.style.color = "red";
        return;
    }

    messageBox.innerText = "Creating account...";
    messageBox.style.color = "#bc6ff1";

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
            messageBox.style.color = "lightgreen";
            messageBox.innerText = "Account created! You can now login.";
            setTimeout(() => openAuth('login'), 2000);
        } else {
            messageBox.style.color = "red";
            messageBox.innerText = result.error || "Signup failed.";
        }
    } catch (error) {
        messageBox.style.color = "red";
        messageBox.innerText = "Server error.";
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageBox = document.getElementById('login-msg');

    messageBox.innerText = "Verifying...";
    messageBox.style.color = "#bc6ff1"; 

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            messageBox.innerText = `Welcome back!`;
            localStorage.setItem('user_email', result.user.email);
            localStorage.setItem('golden_balance', result.user.g_bucks || 0);

            updateUIState(result.user.email, result.user.g_bucks || 0);
            updateStats(); // <--- Refresh all stats on login

            setTimeout(closeAuth, 1000);
        } else {
            messageBox.style.color = "red";
            messageBox.innerText = result.error || "Login failed.";
        }
    } catch (error) {
        messageBox.style.color = "red";
        messageBox.innerText = "Server error.";
    }
}

function updateUIState(email, balance) {
    document.getElementById('logged-out-box').style.display = 'none';
    document.getElementById('logged-in-box').style.display = 'flex';
    document.getElementById('user-display').innerText = email;
    const personalDisplay = document.getElementById('personal-balance');
    if (personalDisplay) personalDisplay.innerText = balance;
}

function handleLogout() {
    // 1. Clear Storage
    localStorage.removeItem('user_email');
    localStorage.removeItem('golden_balance');

    // 2. Reset UI Elements
    document.getElementById('logged-out-box').style.display = 'flex';
    document.getElementById('logged-in-box').style.display = 'none';
    document.getElementById('user-display').innerText = "";
    
    // 3. Clear G-Bucks displays (Both the sidebar and any balance spans)
    const personalDisplay = document.getElementById('personal-balance');
    const gBucksSpan = document.getElementById('g-bucks'); // The sidebar counter
    const email = localStorage.getItem('user_email') || "";
    if (personalDisplay) personalDisplay.innerText = "0";
    if (gBucksSpan) gBucksSpan.innerText = "0"; // Force reset to 0
    
    if (document.getElementById('golden-state')) {
        document.getElementById('golden-state').innerText = "Ready";
    }
    
    // 4. Final sync to get guest likes/views
    updateStats(false); 
}

// --- REWARD LOGIC ---

const goldenBtn = document.getElementById("golden-thumb-btn");
const goldenState = document.getElementById("golden-state");

if (goldenBtn) {
    goldenBtn.addEventListener("click", async () => {
        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) {
            showGameModal("Login Required", "You must be logged in to claim rewards!");
            return;
        }

        if (goldenState) goldenState.innerText = "Claiming...";
        goldenBtn.disabled = true;

        try {
            const res = await fetch("/claim-daily", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail })
            });
            const data = await res.json();

            if (data.success) {
                // Success: update balance and stats immediately
                localStorage.setItem('golden_balance', data.new_balance);
                updateUIState(userEmail, data.new_balance);
                updateStats(); // <--- Full stats refresh

                if (goldenState) goldenState.innerText = "Claimed!";
                showGameModal("Reward Claimed! 💎", "You earned 1 G-Buck! Come back tomorrow.");
                setTimeout(() => { if (goldenState) goldenState.innerText = "Done"; }, 3000);
            } else {
                if (goldenState) goldenState.innerText = "Wait ⏳";
                const errorMsg = data.error || data.message || "Try again later";
                showGameModal("Too Soon!", errorMsg); 
            }
        } catch (err) {
            if (goldenState) goldenState.innerText = "Error ❌";
            showGameModal("System Error", "Something went wrong.");
        } finally {
            goldenBtn.disabled = false;
        }
    });
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(showAdRandomly, 500);
    
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        if (localStorage.getItem('hasLiked') === 'true') {
            likeBtn.disabled = true;
            likeBtn.style.opacity = "0.7";
            likeBtn.innerHTML = `👍 Liked | <span id="likes">...</span>`;
        }
        likeBtn.addEventListener('click', () => updateStats(true));
    }

    updateStats(false); // Initial load

    const savedEmail = localStorage.getItem('user_email');
    const savedBalance = localStorage.getItem('golden_balance');
    if (savedEmail) {
        updateUIState(savedEmail, savedBalance || 0);
    }
});