// --- 1. SETUP & UTILS ---
console.log("Script starting..."); // This helps us know it loaded

// Function to handle the Search Bar
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            card.style.display = title.includes(term) ? 'block' : 'none';
        });
    });
}

// --- 2. GAME MODAL FUNCTIONS ---
// These are global so HTML onclick can see them
// Variable to store what the user actually owns
let ownedGames = []; 

// Variable to track what we are currently trying to buy
let pendingPurchase = null;

async function openGame(title, gameUrl, gameId, price = 50, requiredLevel = 1) {
    const email = localStorage.getItem('user_email');
    
    // 1. Check if logged in first
    if (!email) {
        showAuthWarning();
        return;
    }

    // 2. Level Requirement Check
    // We fetch the current level from the UI or calculate it from data
    const currentLevel = parseInt(document.getElementById('player-level').innerText) || 1;

    if (currentLevel < requiredLevel) {
        showToast(`🔒 Level ${requiredLevel} Required! <br> <span style="color:#aaa; font-size:0.8rem;">You are currently Level ${currentLevel}</span>`);
        return;
    }

    // 3. Ownership Check (Existing logic)
    if (!ownedGames.includes(gameId)) {
        showPurchaseModal(title, gameId, price);
        return;
    }

    // 4. Open the game (Existing logic)
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const gameFrameContainer = document.getElementById('gameFrameContainer');
    
    if (modal) {
        modal.style.display = 'flex';
        modalTitle.textContent = title;
        gameFrameContainer.innerHTML = `<iframe src="${gameUrl}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe>`;
    }
}

function showPurchaseModal(title, gameId, price) {
    const pModal = document.getElementById('purchaseModal');
    const confirmBtn = document.getElementById('confirmPurchaseBtn');
    const msgEl = document.getElementById('purchaseMessage');

    // Reset UI in case it showed "Success" from a previous click
    msgEl.innerText = `Would you like to unlock this game permanently for ${price} 💎?`;
    msgEl.style.color = "white";
    confirmBtn.innerText = "Confirm Purchase";
    confirmBtn.disabled = false;

    document.getElementById('purchaseTitle').innerText = `Unlock ${title}`;
    
    // Set the click action
    confirmBtn.onclick = async () => {
        confirmBtn.innerText = "Processing...";
        confirmBtn.disabled = true;
        
        await buyGame(gameId, price);
        
        // Notice: We REMOVED closePurchaseModal() from here. 
        // buyGame will handle closing after the success message shows.
    };

    pModal.style.display = 'flex';
}
function getLevelInfo(xp) {
    // Current Level
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    
    // XP needed for THIS level: (Level - 1)^2 * 100
    // XP needed for NEXT level: (Level)^2 * 100
    const currentLevelThreshold = Math.pow(level - 1, 2) * 100;
    const nextLevelThreshold = Math.pow(level, 2) * 100;
    
    // Progress within the current level
    const xpInThisLevel = xp - currentLevelThreshold;
    const xpRequiredForNext = nextLevelThreshold - currentLevelThreshold;
    const percent = (xpInThisLevel / xpRequiredForNext) * 100;

    return {
        level: level,
        nextXP: nextLevelThreshold,
        percent: Math.min(percent, 100) // Caps at 100%
    };
}

async function updateGameStats() {
    const levelSpan = document.getElementById('player-level');
    const ratioSpan = document.getElementById('xp-ratio');
    const barFill = document.getElementById('xp-bar-fill');
    const email = localStorage.getItem('user_email') || ""; 

    // 1. IF GUEST: Show everything as Level 1/Locked so they can see the requirements
    if (!email) {
        if (document.querySelector('.level-container')) document.querySelector('.level-container').style.display = 'none';
        
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const reqLevel = parseInt(card.getAttribute('data-level')) || 1;
            const badge = card.querySelector('.level-badge');
            card.classList.add('locked'); // Guests are effectively Lv 0/1
            if (badge) badge.innerHTML = `🔒 Lv. ${reqLevel}`;
        });
        return; 
    }

    try {
        // 2. FETCH REAL DATA
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}`);
        if (!res.ok) return;
        const data = await res.json();

        const currentXP = data.xp || 0;
        const info = getLevelInfo(currentXP);
        const realLevel = info.level;
        ownedGames = data.owned_games || []; 

        // 3. UPDATE UI
        if (levelSpan) levelSpan.innerText = realLevel;
        if (ratioSpan) ratioSpan.innerText = `${currentXP}/${info.nextXP}`;
        if (barFill) barFill.style.width = info.percent + "%";
        if (document.getElementById('g-bucks')) {
            document.getElementById('g-bucks').innerText = data.gbucks ?? "0";
        }

        // 4. THE FIX: Apply classes to reveal the badges
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const reqLevel = parseInt(card.getAttribute('data-level')) || 1;
            const badge = card.querySelector('.level-badge');
            
            // Clean slate
            card.classList.remove('locked', 'unlocked');

            if (realLevel < reqLevel) {
                card.classList.add('locked');
                if (badge) badge.innerHTML = `🔒 Lv. ${reqLevel}`;
            } else {
                card.classList.add('unlocked'); // This triggers 'opacity: 1' in your CSS
                if (badge) badge.innerHTML = `Lv. ${reqLevel}+`;
            }
        });

    } catch (err) {
        console.error("Stats sync failed:", err);
    }
}

function closePurchaseModal() {
    document.getElementById('purchaseModal').style.display = 'none';
}



function closeGame() {
    const modal = document.getElementById('gameModal');
    const gameFrameContainer = document.getElementById('gameFrameContainer');
    
    if (modal) modal.style.display = 'none';
    if (document.fullscreenElement) document.exitFullscreen();
    if (gameFrameContainer) gameFrameContainer.innerHTML = '';
}

function toggleFullScreen() {
    const container = document.getElementById('gameFrameContainer');
    if (!container) return;
    if (!document.fullscreenElement) {
        if(container.requestFullscreen) container.requestFullscreen();
        else if(container.webkitRequestFullscreen) container.webkitRequestFullscreen();
    } else {
        if(document.exitFullscreen) document.exitFullscreen();
    }
}

// Close game if clicking background
window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target == modal) closeGame();
}


// --- 3. ADVERTISEMENT LOGIC ---

function showAdRandomly() {
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    if (!adPopup || !adImage) return;

    // 1. Set the Image
    const adFiles = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png", "ads/ad4.png", "ads/ad5.png", "ads/ad6.png", "ads/ad7.png", "ads/ad8.png", "ads/ad9.png", "ads/ad10.png", "ads/ad11.png", "ads/ad12.png", "ads/ad13.png", "ads/ad14.png", "ads/ad15.png", "ads/ad16.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    // 2. Clear ALL previous positioning and classes
    // This is crucial so "top" doesn't fight with "bottom" from the last ad
    adPopup.style.top = 'auto';
    adPopup.style.bottom = 'auto';
    adPopup.style.left = 'auto';
    adPopup.style.right = 'auto';
    adPopup.classList.remove('slide-in-top', 'slide-in-bottom', 'slide-in-left', 'slide-in-right');

    // 3. Define Dimensions
    const adWidth = 300; 
    const adHeight = 200; // This should match your approx image height
    const maxLeft = window.innerWidth - adWidth;
    const maxTop = window.innerHeight - adHeight;

    // 4. Randomly pick an edge: 0=Top, 1=Right, 2=Bottom, 3=Left
    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) { 
        // --- TOP EDGE ---
        adPopup.style.top = '30px'; 
        // Randomize horizontal position
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-top');

    } else if (edge === 1) { 
        // --- RIGHT EDGE ---
        adPopup.style.right = '30px';
        // Randomize vertical position
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-right');

    } else if (edge === 2) { 
        // --- BOTTOM EDGE ---
        adPopup.style.bottom = '30px';
        // Randomize horizontal position
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-bottom');

    } else { 
        // --- LEFT EDGE ---
        adPopup.style.left = '30px';
        // Randomize vertical position
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-left');
    }

    // 5. Show the ad
    adPopup.style.display = 'block';
}

function closeAd() {
    const adPopup = document.getElementById('adPopup');
    if (adPopup) {
        adPopup.style.display = 'none';
        // Show again in 60 seconds
        setTimeout(showAdRandomly, 60000);
    }
}

// --- 4. STARTUP ---
document.addEventListener("DOMContentLoaded", function() {
    showAdRandomly();
    updateGameStats();
});


// --- 5. G-BUCKS SYSTEM ---

async function buyGame(gameId, price) {
    const email = localStorage.getItem('user_email');
    const msgEl = document.getElementById('purchaseMessage');
    
    if (!email) {
        showAuthWarning();
        return;
    }

    try {
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}&action=purchase&gameId=${gameId}&price=${price}`, {
            method: 'POST'
        });

        const result = await res.json();

        if (res.ok) {
            msgEl.innerText = "✅ Success! You now own this game.";
            msgEl.style.color = "#4ecca3"; 
            
            await updateGameStats(); // Wait for stats to sync
            
            // Wait 2 seconds so they can see the success message
            setTimeout(closePurchaseModal, 2000);
        } else {
            msgEl.innerText = "❌ " + (result.error || "Purchase failed.");
            msgEl.style.color = "#ff4444";
            document.getElementById('confirmPurchaseBtn').disabled = false;
            document.getElementById('confirmPurchaseBtn').innerText = "Try Again";
        }
    } catch (err) {
        console.error("Purchase error:", err);
        msgEl.innerText = "❌ Server error. Try again later.";
    }
}


// Add these to the bottom of script.js if they aren't there
function showAuthWarning() {
    document.getElementById('authWarningModal').style.display = 'flex';
}

function closeAuthWarning() {
    document.getElementById('authWarningModal').style.display = 'none';
}

// --- 6. PASSIVE XP SYSTEM ---
async function awardPassiveXP() {
    const email = localStorage.getItem('user_email');
    if (!email || ownedGames.length === 0) return;

    const xpGain = 40 + 4 * ownedGames.length; 

    try {
        // Add a random 'nonce' or timestamp to the URL to bypass Cloudflare's cache
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}&action=addXP&amount=${xpGain}&t=${Date.now()}`, {
            method: 'POST'
        });

        if (res.ok) {
            console.log(`Earned ${xpGain} XP!`);
            
            // OPTIONAL: Instead of fetching stats again, just update the text 
            // visually so the user thinks it updated instantly.
            const ratioSpan = document.getElementById('xp-ratio');
            if (ratioSpan) {
                // This is a "silent" update. The real data will sync 
                // when the user refreshes or buys a game.
                ratioSpan.style.color = "#4ecca3"; // Turn green briefly to show it worked
                setTimeout(() => ratioSpan.style.color = "white", 2000);
            }
        }
    } catch (err) {
        if (err.status === 429) {
            console.warn("Cloudflare is rate-limiting you. Try a longer timer.");
        }
    }
}

// --- TIMER LOGIC ---
let xpSecondsLeft = 180; // 10 minutes in seconds

function updateXPTimerUI() {
    const timerSpan = document.getElementById('xp-timer');
    if (!timerSpan) return;

    const mins = Math.floor(xpSecondsLeft / 60);
    const secs = xpSecondsLeft % 60;

    timerSpan.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;

    if (xpSecondsLeft <= 0) {
        // --- THE FIX IS HERE ---
        awardPassiveXP();    // Actually give the XP to the player
        xpSecondsLeft = 180;  // Reset the clock
    } else {
        xpSecondsLeft--;
    }
}

// Start the clock ticking every 1 second
setInterval(updateXPTimerUI, 1000);

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = message;

    container.appendChild(toast);

    // Automatically remove the element from the code after the animation finishes
    setTimeout(() => {
        toast.remove();
    }, 3000);
}