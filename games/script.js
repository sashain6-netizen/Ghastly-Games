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

async function openGame(title, gameUrl, gameId, price = 50) {
    // 1. Check if user owns it
    if (!ownedGames.includes(gameId)) {
        showPurchaseModal(title, gameId, price);
        return;
    }

    // 2. Normal open logic
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
async function updateGameStats() {
    const gBucksSpan = document.getElementById('g-bucks');
    
    try {
        // Get email from localStorage (saved by your main page login)
        const email = localStorage.getItem('user_email') || ""; 

        // Fetch from the root /stats worker
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}`);
        if (!res.ok) return;

        const data = await res.json();

        // Update the G-Bucks span if it exists on this page
        if (gBucksSpan) {
            gBucksSpan.innerText = data.gbucks ?? "...";
        }
    } catch (err) {
        console.error("G-Bucks sync failed in /games/:", err);
    }
}

async function buyGame(gameId, price) {
    const email = localStorage.getItem('user_email');
    
    // 1. Swap alert with Custom Auth Modal
    if (!email) {
        showAuthWarning();
        return;
    }

    // (Note: The "Confirm" part is now handled by showPurchaseModal clicking this function)

    try {
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}&action=purchase&gameId=${gameId}&price=${price}`, {
            method: 'POST'
        });

        const result = await res.json();

        if (res.ok) {
            // 2. Success Feedback (Update the modal text instead of an alert)
            const msgEl = document.getElementById('purchaseMessage');
            if (msgEl) msgEl.innerText = "Success! You now own this game.";
            
            updateGameStats(); // Refresh balance
            
            // Auto-close the purchase modal after 1.5 seconds
            setTimeout(closePurchaseModal, 1500);
        } else {
            // 3. Error Feedback
            alert(result.error || "Purchase failed."); // You can also put this in purchaseMessage
        }
    } catch (err) {
        console.error("Purchase error:", err);
        showAuthWarning(); // Or a general error modal
    }
}

// Add these to the bottom of script.js if they aren't there
function showAuthWarning() {
    document.getElementById('authWarningModal').style.display = 'flex';
}

function closeAuthWarning() {
    document.getElementById('authWarningModal').style.display = 'none';
}


