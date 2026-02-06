// --- LIKE & STATS SYSTEM ---

async function updateStats(isClick = false) {
    console.log("updateStats called. Click mode:", isClick);
    
    const likeDisplay = document.getElementById('likes'); 
    const viewDisplay = document.getElementById('views');
    const goldenCountSpan = document.getElementById('golden-count');
    const likeBtn = document.getElementById('like-btn');

    try {
        const method = isClick ? 'POST' : 'GET';
        const res = await fetch('/stats', { method });
        
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
        const data = await res.json();
        console.log("Worker returned data:", data);

        // Update the HTML - using the keys your worker sends
        if (likeDisplay) likeDisplay.innerText = data.likes ?? 0;
        if (viewDisplay) viewDisplay.innerText = data.views ?? 0;
        if (goldenCountSpan) goldenCountSpan.innerText = data.global_total ?? 0;

        // Handle the Button UI
        if (isClick && likeBtn) {
            likeBtn.disabled = true;
            likeBtn.innerHTML = `👍 Liked | <span id="likes">${data.likes}</span>`;
            localStorage.setItem('hasLiked', 'true');
        }
    } catch (err) {
        console.error("Stats sync failed:", err);
    }
}

// --- PAGE LOAD INITIALIZATION ---

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    // 1. Ads Timer
    setTimeout(() => {
        if (typeof showAdRandomly === "function") showAdRandomly();
    }, 500);
    
    // 2. Setup Like Button Listener
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        // Check local storage status
        if (localStorage.getItem('hasLiked') === 'true') {
            likeBtn.disabled = true;
            likeBtn.innerHTML = `👍 Liked | <span id="likes">...</span>`;
        }

        likeBtn.addEventListener('click', function() {
            updateStats(true);
        });
    }

    // 3. Kick off the stats fetch (This replaces the '...')
    updateStats(false);

    // 4. Handle Account state
    const savedEmail = localStorage.getItem('user_email');
    const savedBalance = localStorage.getItem('golden_balance');
    if (savedEmail && typeof updateUIState === "function") {
        updateUIState(savedEmail, savedBalance || 0);
    }
});