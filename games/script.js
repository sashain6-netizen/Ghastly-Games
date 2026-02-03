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
    const adFiles = ["ad1.png", "ad2.png", "ad3.png", "ad4.png", "ad5.png", "ad6.png", "ad7.png", "ad8.png", "ad9.png", "ad10.png", "ad11.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    // 2. Force the dimensions (Use your ad's actual size here)
    // This prevents the "0 height" bug if the image hasn't loaded yet
    const adWidth = 300; 
    const adHeight = 200; 

    // 3. Calculate safe boundaries (Window size minus ad size minus 50px padding)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const maxLeft = windowWidth - adWidth - 50; 
    const maxTop = windowHeight - adHeight - 50;

    // Ensure we don't get negative numbers
    const randomLeft = Math.floor(Math.random() * Math.max(0, maxLeft));
    const randomTop = Math.floor(Math.random() * Math.max(0, maxTop));

    // 4. IMPORTANT: Clear the 'bottom' and 'right' styles from CSS
    // If we don't do this, 'bottom: 20px' might fight with 'top'
    adPopup.style.bottom = 'auto';
    adPopup.style.right = 'auto';

    // 5. Apply the new Random Positions
    adPopup.style.left = randomLeft + "px";
    adPopup.style.top = randomTop + "px";

    // 6. Show the ad
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