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
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    if (!adPopup || !adImage) return;

    // 1. Set the Image
    const adFiles = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png", "ads/ad4.png", "ads/ad5.png", "ads/ad6.png", "ads/ad7.png", "ads/ad8.png", "ads/ad9.png", "ads/ad10.png", "ads/ad11.png", "ads/ad12.png", "ads/ad13.png", "ads/ad14.png", "ads/ad15.png"];
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
// This ensures the page is 100% ready before running code
document.addEventListener("DOMContentLoaded", function() {
    showAdRandomly();
});