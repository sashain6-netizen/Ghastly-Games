// Get DOM elements
const searchInput = document.getElementById('searchInput');
const gameCards = document.querySelectorAll('.game-card');
const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const gameFrameContainer = document.getElementById('gameFrameContainer');

// Function to filter games based on search input
searchInput.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    gameCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
    });
});

// Function to open the game modal
function openGame(title, gameUrl) {
    modal.style.display = 'flex';
    modalTitle.textContent = title;
    
    // We removed the 'sandbox' attribute to let the game engine boot up
    gameFrameContainer.innerHTML = `
        <iframe 
            src="${gameUrl}" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allow="autoplay; game
            pad; fullscreen; keyboard-events; accelerometer; gyroscope" 
            allowfullscreen>
        </iframe>`;
}

// Function to close the modal
function closeGame() {
    modal.style.display = 'none';
    
    // Exit full screen if it's currently active when closing
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }

    // Reset the screen so music stops
    gameFrameContainer.innerHTML = '<div class="placeholder-screen"><p>Game Loaded Here</p></div>';
}

// Function to toggle Full Screen
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

// Close modal if clicking outside the content box
window.onclick = function(event) {
    if (event.target == modal) {
        closeGame();
    }
}
// ... existing JS ...

// Function to close the ad pop-up
// Function to show the ad at a random spot
// Function to show the ad with a Random Image at a Random Spot
// --- Random Ad Logic ---

// Function to show the ad with a Random Image at a Random Spot
function showAdRandomly() {
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    // --- 1. Random Image Logic ---
    const adFiles = [
        "Screenshot 2026-02-02 11.58.48 AM.png", 
        "Screenshot 2026-02-02 1.16.36 PM.png"
    ];

    // Pick a random index (0 or 1)
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    
    // Set the image source immediately
    adImage.src = adFiles[randomIndex];

    // --- 2. Random Position Logic ---
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Get dimensions (fallback to 300x200 if not yet rendered)
    const adWidth = adPopup.offsetWidth || 300; 
    const adHeight = adPopup.offsetHeight || 200;

    const maxLeft = windowWidth - adWidth;
    const maxTop = windowHeight - adHeight;

    const randomLeft = Math.floor(Math.random() * Math.max(0, maxLeft));
    const randomTop = Math.floor(Math.random() * Math.max(0, maxTop));

    // Reset bottom/right to allow top/left positioning
    adPopup.style.bottom = 'auto';
    adPopup.style.right = 'auto';
    adPopup.style.left = randomLeft + 'px';
    adPopup.style.top = randomTop + 'px';

    // --- 3. Show the ad ---
    adPopup.style.display = 'block';
}

// Function to close the ad
function closeAd() {
    document.getElementById('adPopup').style.display = 'none';
    
    // Optional: Show another ad after 60 seconds
    setTimeout(showAdRandomly, 60000);
}

// --- CRITICAL: Run this immediately when the page loads ---
window.onload = function() {
    showAdRandomly();
};

function closeAd() {
    document.getElementById('adPopup').style.display = 'none';
    // Set timer for the next ad (60 seconds)
    setTimeout(showAdRandomly, 60000);
}

// --- CRITICAL STEP: Run this when page loads ---
// This forces the very first ad to be randomized
window.onload = function() {
    showAdRandomly();
};

// Ensure the first ad on page load is also randomized (Optional)
// Add this line at the very bottom of your script if you want the first one to be random too:
// showAdRandomly();

// Function to close the ad and start the timer
function closeAd() {
    const adPopup = document.getElementById('adPopup');
    adPopup.style.display = 'none';

    // Set a timer for 100 seconds (100,000 milliseconds)
    // After the time is up, it runs 'showAdRandomly'
    setTimeout(showAdRandomly, 60000);
}