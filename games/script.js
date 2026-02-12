console.log("Script starting..."); 

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

let ownedGames = []; 

let pendingPurchase = null;

async function openGame(title, gameUrl, gameId, price = 50, requiredLevel = 1) {
    const email = localStorage.getItem('user_email');

    if (!email) {
        showAuthWarning();
        return;
    }

    const currentLevel = parseInt(document.getElementById('player-level').innerText) || 1;

    if (currentLevel < requiredLevel) {
        showToast(`🔒 Level ${requiredLevel} Required! <br> <span style="color:#aaa; font-size:0.8rem;">You are currently Level ${currentLevel}</span>`);
        return;
    }

    if (!ownedGames.includes(gameId)) {
        showPurchaseModal(title, gameId, price);
        return;
    }

    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const gameFrameContainer = document.getElementById('gameFrameContainer');

    if (modal) {
        modal.style.display = 'flex';
        modalTitle.textContent = title;
        gameFrameContainer.innerHTML = `<iframe src="${gameUrl}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe>`;
    }
}

function showPurchaseModal(title, gameId, price) {
    const pModal = document.getElementById('purchaseModal');
    const confirmBtn = document.getElementById('confirmPurchaseBtn');
    const msgEl = document.getElementById('purchaseMessage');

    msgEl.innerText = `Would you like to unlock this game permanently for ${price} 💎?`;
    msgEl.style.color = "white";
    confirmBtn.innerText = "Confirm Purchase";
    confirmBtn.disabled = false;

    document.getElementById('purchaseTitle').innerText = `Unlock ${title}`;

    confirmBtn.onclick = async () => {
        confirmBtn.innerText = "Processing...";
        confirmBtn.disabled = true;

        await buyGame(gameId, price);

    };

    pModal.style.display = 'flex';
}
function getLevelInfo(xp) {
    let level = 1;
    let xpForNextLevel = 100; 

    let cumulativeXPToReachLevel = 0;

    while (xp >= cumulativeXPToReachLevel + (level * 100)) {
        cumulativeXPToReachLevel += (level * 100);
        level++;
    }

    const xpRequiredForThisLevel = level * 100; 

    const xpInThisLevel = xp - cumulativeXPToReachLevel;
    const percent = (xpInThisLevel / xpRequiredForThisLevel) * 100;

    return {
        level: level,
        xpInThisLevel: xpInThisLevel,
        xpRequiredForThisLevel: xpRequiredForThisLevel,
        percent: Math.min(percent, 100)
    };
}

async function updateGameStats() {
    const levelSpan = document.getElementById('player-level');
    const ratioSpan = document.getElementById('xp-ratio');
    const barFill = document.getElementById('xp-bar-fill');
    const email = localStorage.getItem('user_email') || ""; 

    if (!email) {
        if (document.querySelector('.level-container')) document.querySelector('.level-container').style.display = 'none';

        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const reqLevel = parseInt(card.getAttribute('data-level')) || 1;
            const badge = card.querySelector('.level-badge');
            card.classList.add('locked'); 

            if (badge) badge.innerHTML = `🔒 Lv. ${reqLevel}`;
        });
        return; 
    }

    try {

        const res = await fetch(`/stats?email=${encodeURIComponent(email)}`);
        if (!res.ok) return;
        const data = await res.json();

        const currentXP = data.xp || 0;
        const info = getLevelInfo(currentXP);
        const realLevel = info.level;
        ownedGames = data.owned_games || []; 

        if (levelSpan) levelSpan.innerText = realLevel;
        if (ratioSpan) ratioSpan.innerText = `${info.xpInThisLevel}/${info.xpRequiredForThisLevel}`;
        if (barFill) barFill.style.width = info.percent + "%";
        if (document.getElementById('g-bucks')) {
            document.getElementById('g-bucks').innerText = data.gbucks ?? "0";
        }

        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const reqLevel = parseInt(card.getAttribute('data-level')) || 1;
            const badge = card.querySelector('.level-badge');

            card.classList.remove('locked', 'unlocked');

            if (realLevel < reqLevel) {
                card.classList.add('locked');
                if (badge) badge.innerHTML = `🔒 Lv. ${reqLevel}`;
            } else {
                card.classList.add('unlocked'); 

                if (badge) badge.innerHTML = `Lv. ${reqLevel}+`;
            }
        });

    } catch (err) {
        console.error("Stats sync failed:", err);
    }
}

function closePurchaseModal() {
    document.getElementById('purchaseModal').style.display = 'none';
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

function openSource(sourceUrl) {
    window.location.href = "sourceUrl"
}

window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target == modal) closeGame();
}

function showAdRandomly() {
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    if (!adPopup || !adImage) return;

    const adFiles = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png", "ads/ad4.png", "ads/ad5.png", "ads/ad6.png", "ads/ad7.png", "ads/ad8.png", "ads/ad9.png", "ads/ad10.png", "ads/ad11.png", "ads/ad12.png", "ads/ad13.png", "ads/ad14.png", "ads/ad15.png", "ads/ad16.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    adPopup.style.top = 'auto';
    adPopup.style.bottom = 'auto';
    adPopup.style.left = 'auto';
    adPopup.style.right = 'auto';
    adPopup.classList.remove('slide-in-top', 'slide-in-bottom', 'slide-in-left', 'slide-in-right');

    const adWidth = 300; 
    const adHeight = 200; 

    const maxLeft = window.innerWidth - adWidth;
    const maxTop = window.innerHeight - adHeight;

    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) { 

        adPopup.style.top = '30px'; 

        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-top');

    } else if (edge === 1) { 

        adPopup.style.right = '30px';

        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-right');

    } else if (edge === 2) { 

        adPopup.style.bottom = '30px';

        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-bottom');

    } else { 

        adPopup.style.left = '30px';

        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-left');
    }

    adPopup.style.display = 'block';
}

function closeAd() {
    const adPopup = document.getElementById('adPopup');
    if (adPopup) {
        adPopup.style.display = 'none';

        setTimeout(showAdRandomly, 60000);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    showAdRandomly();
    updateGameStats();
});

async function buyGame(gameId, price) {
    const email = localStorage.getItem('user_email');
    const msgEl = document.getElementById('purchaseMessage');

    if (!email) {
        showAuthWarning();
        return;
    }

    try {
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}&action=purchase&gameId=${gameId}&price=${price}`, {
            method: 'POST'
        });

        const result = await res.json();

        if (res.ok) {
            msgEl.innerText = "✅ Success! You now own this game.";
            msgEl.style.color = "#4ecca3"; 

            await updateGameStats(); 

            setTimeout(closePurchaseModal, 2000);
        } else {
            msgEl.innerText = "❌ " + (result.error || "Purchase failed.");
            msgEl.style.color = "#ff4444";
            document.getElementById('confirmPurchaseBtn').disabled = false;
            document.getElementById('confirmPurchaseBtn').innerText = "Try Again";
        }
    } catch (err) {
        console.error("Purchase error:", err);
        msgEl.innerText = "❌ Server error. Try again later.";
    }
}

function showAuthWarning() {
    document.getElementById('authWarningModal').style.display = 'flex';
}

function closeAuthWarning() {
    document.getElementById('authWarningModal').style.display = 'none';
}

async function awardPassiveXP() {
    const email = localStorage.getItem('user_email');
    if (!email || ownedGames.length === 0) return;

    const xpGain = 150 + 8 * ownedGames.length; 

    try {
        const res = await fetch(`/stats?email=${encodeURIComponent(email)}&action=addXP&amount=${xpGain}&t=${Date.now()}`, {
            method: 'POST'
        });

        if (res.ok) {
            console.log("XP Synced with server.");

            setTimeout(async () => {
                await updateGameStats(); 
            }, 500);

            const ratioSpan = document.getElementById('xp-ratio');
            if (ratioSpan) {
                ratioSpan.style.color = "#4ecca3";
                setTimeout(() => ratioSpan.style.color = "white", 2000);
            }
        }
    } catch (err) {
        console.error("Server sync failed:", err);
    }
}

let xpSecondsLeft = 600; 

function updateXPTimerUI() {
    const timerSpan = document.getElementById('xp-timer');
    if (!timerSpan) return;

    const mins = Math.floor(xpSecondsLeft / 60);
    const secs = xpSecondsLeft % 60;

    timerSpan.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;

    if (xpSecondsLeft <= 0) {

        awardPassiveXP();    

        xpSecondsLeft = 600;  

    } else {
        xpSecondsLeft--;
    }
}

setInterval(updateXPTimerUI, 1000);

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}