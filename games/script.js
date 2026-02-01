// Get DOM elements
const searchInput = document.getElementById('searchInput');
const gameCards = document.querySelectorAll('.game-card');
const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
// Get the container we want to make full screen
const gameFrameContainer = document.getElementById('gameFrameContainer');

// Function to filter games based on search input
searchInput.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();

    gameCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        if (title.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Function to open the game modal
function openGame(title, gameUrl) {
    modal.style.display = 'flex';
    modalTitle.textContent = title;
    
    console.log(`Loading game: ${title} from ${gameUrl}`);
    
    // Uncomment this when using real links to load the game:
    // gameFrameContainer.innerHTML = `<iframe src="${gameUrl}" allowfullscreen></iframe>`;
}

// Function to close the modal
function closeGame() {
    modal.style.display = 'none';
    
    // Exit full screen if it's currently active when closing
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }

    // Clear iframe content
    // gameFrameContainer.innerHTML = '<div class="placeholder-screen"><p>Game Loaded Here</p></div>';
}

// NEW: Function to toggle Full Screen
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        // Request full screen on the container
        if (gameFrameContainer.requestFullscreen) {
            gameFrameContainer.requestFullscreen();
        } else if (gameFrameContainer.webkitRequestFullscreen) { /* Safari */
            gameFrameContainer.webkitRequestFullscreen();
        } else if (gameFrameContainer.msRequestFullscreen) { /* IE11 */
            gameFrameContainer.msRequestFullscreen();
        }
    } else {
        // Exit full screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

// Close modal if clicking outside the content box
window.onclick = function(event) {
    if (event.target == modal) {
        closeGame();
    }
}