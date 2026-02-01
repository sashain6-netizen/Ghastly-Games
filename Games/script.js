// 1. Detect the current folder/path
const currentPath = window.location.pathname;

// 2. Function to "launch" a game by redirecting to a subfolder
function launchGame(gameName) {
    // Redirects from example.pages.dev/ to example.pages.dev/gameName/
    window.location.href = `/${gameName}/`;
}

// 3. Update the page content based on where the user is
window.addEventListener('DOMContentLoaded', () => {
    const statusDisplay = document.getElementById('status');
    
    if (currentPath === '/' || currentPath === '/index.html') {
        statusDisplay.innerText = "You are on the Home Page";
    } else {
        // Extracts folder name from path (e.g., "/mario/" -> "mario")
        const folderName = currentPath.split('/').filter(Boolean).pop();
        statusDisplay.innerText = `Successfully loaded folder: ${folderName}`;
    }
});
