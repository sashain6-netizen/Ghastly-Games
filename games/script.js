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
function openGame(title, gameUrl) {
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const gameFrameContainer = document.getElementById('gameFrameContainer');
    
    if (modal) {
        modal.style.display = 'flex';
        if (modalTitle) modalTitle.textContent = title;
        if (gameFrameContainer) {
            gameFrameContainer.innerHTML = `<iframe src="${gameUrl}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe>`;
        }
    }
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
    console.log("Running showAdRandomly..."); // Debug check

    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    // Safety Check: If HTML is missing, stop here
    if (!adPopup || !adImage) {
        console.error("CRITICAL: ID 'adPopup' or 'adImage' not found in HTML.");
        return;
    }

    // --- YOUR IMAGES HERE ---
    // Ensure these match your filenames exactly!
    const adFiles = [
        "ad1.png", 
        "ad2.png"
    ];

    const randomIndex = Math.floor(Math.random() * adFiles.length);
    const selectedImage = adFiles[randomIndex];

    console.log("Selected Image:", selectedImage); // See what it picked

    // Force the image source
    adImage.src = selectedImage;

    // Position Math
    const w = window.innerWidth - (adPopup.offsetWidth || 300);
    const h = window.innerHeight - (adPopup.offsetHeight || 200);
    
    const rLeft = Math.floor(Math.random() * Math.max(0, w));
    const rTop = Math.floor(Math.random() * Math.max(0, h));

    adPopup.style.left = rLeft + 'px';
    adPopup.style.top = rTop + 'px';
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
// This ensures the page is 100% ready before running code
document.addEventListener("DOMContentLoaded", function() {
    showAdRandomly();
});