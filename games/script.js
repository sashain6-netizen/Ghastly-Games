// --- 1. DOM Elements ---

alert("Javascript is connected!");

const searchInput = document.getElementById('searchInput');
const gameCards = document.querySelectorAll('.game-card');
const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const gameFrameContainer = document.getElementById('gameFrameContainer');
const adPopup = document.getElementById('adPopup');
const adImage = document.getElementById('adImage');

// --- 2. Search Functionality ---
if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        gameCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            card.style.display = title.includes(term) ? 'block' : 'none';
        });
    });
}

// --- 3. Game Modal Logic ---
function openGame(title, gameUrl) {
    modal.style.display = 'flex';
    modalTitle.textContent = title;
    
    gameFrameContainer.innerHTML = `
        <iframe 
            src="${gameUrl}" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allow="autoplay; gamepad; fullscreen; keyboard-events; accelerometer; gyroscope" 
            allowfullscreen>
        </iframe>`;
}

function closeGame() {
    modal.style.display = 'none';
    
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    // clear iframe to stop sound
    gameFrameContainer.innerHTML = '<div class="placeholder-screen"><p>Game Loaded Here</p></div>';
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (gameFrameContainer.requestFullscreen) {
            gameFrameContainer.requestFullscreen();
        } else if (gameFrameContainer.webkitRequestFullscreen) {
            gameFrameContainer.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Close modal if clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeGame();
    }
}

// --- 4. Random Ad Logic ---

function showAdRandomly() {
    // Grab elements INSIDE the function to ensure they exist
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    if (!adPopup || !adImage) {
        console.error("Ad elements not found! Check HTML IDs.");
        return;
    }

    // --- UPDATED LIST ---
    // We use the new simple names here
    const adFiles = [
        "ad1.png", 
        "ad2.png"
    ];

    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    // --- DEBUGGING LINE ---
    // If it breaks again, press F12, go to Console, and see what this says:
    console.log("Trying to load image:", adFiles[randomIndex]); 

    // 2. Random Position Logic
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Use fallback size (300x200) if ad isn't visible yet
    const adWidth = adPopup.offsetWidth || 300; 
    const adHeight = adPopup.offsetHeight || 200;

    const maxLeft = windowWidth - adWidth;
    const maxTop = windowHeight - adHeight;

    const randomLeft = Math.floor(Math.random() * Math.max(0, maxLeft));
    const randomTop = Math.floor(Math.random() * Math.max(0, maxTop));

    // Reset styles to ensure new position works
    adPopup.style.bottom = 'auto';
    adPopup.style.right = 'auto';
    adPopup.style.left = randomLeft + 'px';
    adPopup.style.top = randomTop + 'px';

    // Show the ad
    adPopup.style.display = 'block';
}

function closeAd() {
    adPopup.style.display = 'none';
    
    // Wait 60 seconds, then show again
    setTimeout(showAdRandomly, 60000);
}

// --- 5. Initialize ---
// Use 'DOMContentLoaded' to ensure HTML is ready before running JS
document.addEventListener("DOMContentLoaded", function() {
    // Start the first ad immediately
    showAdRandomly();
});