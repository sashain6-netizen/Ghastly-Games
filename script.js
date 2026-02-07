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

function showAdRandomly() {
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    if (!adPopup || !adImage) return;

    const adFiles = ["games/ads/ad1.png", "games/ads/ad2.png", "games/ads/ad3.png", "games/ads/ad4.png", "games/ads/ad5.png", "games/ads/ad6.png", "games/ads/ad7.png", "games/ads/ad8.png", "games/ads/ad9.png", "games/ads/ad10.png", "games/ads/ad11.png", "games/ads/ad12.png", "games/ads/ad13.png", "games/ads/ad14.png", "games/ads/ad15.png", "games/ads/ad16.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    adPopup.style.top = 'auto';
    adPopup.style.bottom = 'auto';
    adPopup.style.left = 'auto';
    adPopup.style.right = 'auto';
    adPopup.classList.remove('slide-in-top', 'slide-in-bottom', 'slide-in-left', 'slide-in-right');

    const adWidth = 300; 
    const adHeight = 200; 
    const maxLeft = window.innerWidth - adWidth;
    const maxTop = window.innerHeight - adHeight;

    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) { 
        adPopup.style.top = '30px'; 
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-top');
    } else if (edge === 1) { 
        adPopup.style.right = '30px';
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-right');
    } else if (edge === 2) { 
        adPopup.style.bottom = '30px';
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-bottom');
    } else { 
        adPopup.style.left = '30px';
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-left');
    }

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
// MENU SYSTEM (Logs logic included)
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

if (creditsButton && creditsMenu) {
    creditsButton.addEventListener('click', function() {
        const isClosed = creditsMenu.style.display === 'none';
        closeAllMenus();
        if (isClosed) creditsMenu.style.display = 'block'; 
    });
}

if (logsButton && logsMenu) {
    logsButton.addEventListener('click', function() {
        const isClosed = logsMenu.style.display === 'none';
        closeAllMenus();
        if (isClosed) logsMenu.style.display = 'block';
    });
}

if (infoButton && infoMenu) {
    infoButton.addEventListener('click', function() {
        const isClosed = infoMenu.style.display === 'none';
        closeAllMenus();
        if (isClosed) infoMenu.style.display = 'block';
    });
}

// --- LIKE BUTTON LOGIC ---
const likeBtn = document.getElementById('like-btn');
const likeDisplay = document.getElementById('like-count');
const viewDisplay = document.getElementById('view-count');

async function updateStats(isClick = false) {
    const likeDisplay = document.getElementById('likes'); 
    const viewDisplay = document.getElementById('views');
    const goldenCountSpan = document.getElementById('golden-count');
    const gBucksSpan = document.getElementById('g-bucks'); 
    const likeBtn = document.getElementById('like-btn');

    // 1. STOPS THE FLASH: Show the cached balance immediately if we have it
    const cachedBalance = localStorage.getItem('golden_balance');
    if (cachedBalance !== null && gBucksSpan) {
        gBucksSpan.innerText = cachedBalance;
    }

    try {
        const email = localStorage.getItem('user_email') || ""; 
        const method = isClick ? 'POST' : 'GET';
        
        // 2. Fetch fresh data
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}`, { method });
        if (!res.ok) return; 

        const data = await res.json();

        // 3. Update the UI with fresh data
        if (likeDisplay) likeDisplay.innerText = data.likes ?? "0";
        if (viewDisplay) viewDisplay.innerText = data.views ?? "0";
        if (goldenCountSpan) goldenCountSpan.innerText = data.global_total ?? "0";
        
        if (gBucksSpan && data.gbucks !== null) {
            gBucksSpan.innerText = data.gbucks;
            // Update cache for next time
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



// Account creation and login
// ==========================================
// ACCOUNT, LOGIN & REWARD LOGIC
// ==========================================

function openAuth(type) {
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'none';

    resetForm();
    
    if (type === 'signup') {
        document.getElementById('signup-form-container').style.display = 'block';
    } else {
        document.getElementById('login-form-container').style.display = 'block';
    }
}

function closeAuth(event) {
    if (event && event.target !== document.getElementById('auth-overlay')) return;
    document.getElementById('auth-overlay').style.display = 'none';
}

function resetForm() {
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('signup-msg').innerText = '';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-msg').innerText = '';
}

async function handleSignup() {
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');
  const messageBox = document.getElementById('signup-msg');
  const botCheck = document.getElementById('ghastly_verify');

  if (botCheck && botCheck.value !== "") return; 

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageBox.style.color = "red";
    messageBox.innerText = 'Invalid email format.';
    return;
  }

  messageBox.style.color = "white";
  messageBox.innerText = "Connecting...";

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      messageBox.style.color = "#bc6ff1";
      messageBox.innerText = "Success! Now log in.";
      resetForm(); 
    } else {
      messageBox.style.color = "red";
      messageBox.innerText = result.error || "An error occurred.";
    }
  } catch (err) {
    messageBox.style.color = "red";
    messageBox.innerText = "Server error. Try again later.";
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
            // Storing the balance for local use
            localStorage.setItem('golden_balance', result.user.g_bucks || 0);

            // Update UI
            updateUIState(result.user.email, result.user.g_bucks || 0);

            updateStats();

            setTimeout(() => {
                closeAuth();
            }, 1000);

        } else {
            messageBox.style.color = "red";
            messageBox.innerText = result.error || "Login failed.";
        }
    } catch (error) {
        console.error(error);
        messageBox.style.color = "red";
        messageBox.innerText = "Server error.";
    }
}

function updateUIState(email, balance) {
    document.getElementById('logged-out-box').style.display = 'none';
    document.getElementById('logged-in-box').style.display = 'flex';
    document.getElementById('user-display').innerText = email;
    
    // ✅ FIX: Update the PERSONAL balance span, NOT the global golden-count
    const personalDisplay = document.getElementById('personal-balance');
    if (personalDisplay) personalDisplay.innerText = balance;
}

function handleLogout() {
    localStorage.removeItem('user_email');
    localStorage.removeItem('golden_balance');
    
    document.getElementById('logged-out-box').style.display = 'flex';
    document.getElementById('logged-in-box').style.display = 'none';
    document.getElementById('user-display').innerText = "";
    
    // ✅ FIX: Reset personal balance on logout
    const personalDisplay = document.getElementById('personal-balance');
    if (personalDisplay) personalDisplay.innerText = "0";
    
    document.getElementById('golden-state').innerText = "Ready";
    
    // Refresh global stats to show the real D1 number (0)
    updateStats(false);
}

// --- GOLDEN THUMB BUTTON LOGIC ---

function showGameModal(title, message) {
    const overlay = document.getElementById('game-modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const msgEl = document.getElementById('modal-message');

    if (overlay && titleEl && msgEl) {
        titleEl.innerText = title;
        msgEl.innerText = message;
        overlay.style.display = 'flex'; 
    }
}

function closeGameModal() {
    const overlay = document.getElementById('game-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

const goldenBtn = document.getElementById("golden-thumb-btn");
const goldenState = document.getElementById("golden-state");
// ✅ FIXED: We look for the HTML ID "golden-count"
const goldenCountDisplay = document.getElementById("golden-count");

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
                // ✅ SUCCESS: Update the HTML "golden-count" with the GLOBAL total
                // (assuming data.global_total is the KV variable from backend)
                if (goldenCountDisplay) goldenCountDisplay.innerText = data.global_total;
                
                // Save personal balance
                localStorage.setItem('golden_balance', data.new_balance);
                
                if (goldenState) goldenState.innerText = "Claimed!";
                
                showGameModal("Reward Claimed! 💎", "You earned 1 G-Buck! Come back tomorrow for more.");
                
                setTimeout(() => { if (goldenState) goldenState.innerText = "Done"; }, 3000);

                updateStats();
            } else {
                if (goldenState) goldenState.innerText = "Wait ⏳";
                showGameModal("Too Soon!", data.message); 
            }

        } catch (err) {
            console.error(err);
            if (goldenState) goldenState.innerText = "Error ❌";
            showGameModal("System Error", "Something went wrong. Please check your connection.");
        } finally {
            goldenBtn.disabled = false;
        }
    });
}

// --- PAGE LOAD INITIALIZATION ---
// --- PAGE LOAD INITIALIZATION ---
document.addEventListener("DOMContentLoaded", function() {
    // 1. Ads Timer
    setTimeout(() => {
        console.log("Ghastly Hub: Initializing Ads...");
        showAdRandomly();
    }, 500);
    
    // 2. Setup Like Button
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        // IMPORTANT: Check if they already liked it before adding the listener
        if (localStorage.getItem('hasLiked') === 'true') {
            likeBtn.disabled = true;
            likeBtn.style.opacity = "0.7";
            // We'll let updateStats fill in the number, but we set the text now
            likeBtn.innerHTML = `👍 Liked | <span id="likes">...</span>`;
        }

        likeBtn.addEventListener('click', function() {
            updateStats(true); // Triggers the POST and the increment
        });
    }

    // 3. Initial Stats Fetch (Run this ONCE to fill in all numbers)
    updateStats(false);

    // 4. Handle Account state
    const savedEmail = localStorage.getItem('user_email');
    const savedBalance = localStorage.getItem('golden_balance');
    if (savedEmail) {
        updateUIState(savedEmail, savedBalance || 0);
    }
});

updateStats();