// 1. The Function that talks to the Worker
async function updateStats(isClick = false) {
    const likeDisplay = document.getElementById('likes'); 
    const viewDisplay = document.getElementById('views');
    const goldenCountSpan = document.getElementById('golden-count');
    const likeBtn = document.getElementById('like-btn');

    try {
        const method = isClick ? 'POST' : 'GET';
        const res = await fetch('/stats', { method });
        const data = await res.json();

        // Update the HTML with the numbers from the Worker
        if (likeDisplay) likeDisplay.innerText = data.likes ?? 0;
        if (viewDisplay) viewDisplay.innerText = data.views ?? 0;
        if (goldenCountSpan) goldenCountSpan.innerText = data.global_total ?? 0;

        // If they just clicked, disable the button and save to local storage
        if (isClick && likeBtn) {
            likeBtn.disabled = true;
            localStorage.setItem('hasLiked', 'true');
        }
    } catch (err) {
        console.error("Stats sync failed:", err);
    }
}

// 2. The Initialization (Put this inside your existing DOMContentLoaded)
document.addEventListener("DOMContentLoaded", function() {
    // ... your other code (ads, menus, etc.) ...

    const likeBtn = document.getElementById('like-btn');

    // Check if they already liked it previously
    if (localStorage.getItem('hasLiked') === 'true' && likeBtn) {
        likeBtn.disabled = true;
    }

    // Add the click listener back!
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            updateStats(true); // true = it's a click/POST
        });
    }

    // Call it immediately on load to get the view count and current likes
    updateStats(false); // false = it's a page load/GET
});