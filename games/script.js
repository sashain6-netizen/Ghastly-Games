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
function closeAd() {
    const adPopup = document.getElementById('adPopup');
    adPopup.style.display = 'none';
}