// Game State
let game = {
    score: 0,
    clickPower: 1,
    autoPerSecond: 0
};

// Shop Data
const upgrades = {
    click: { cost: 15, count: 0, power: 1, type: 'click' },
    clone: { cost: 50, count: 0, power: 1, type: 'auto' },
    farm:  { cost: 500, count: 0, power: 10, type: 'auto' }
};

// DOM Elements
const scoreEl = document.getElementById('score');
const anthonyImg = document.getElementById('anthony-face');
const shockwave = document.getElementById('shockwave');
const particlesContainer = document.getElementById('particles-container');

// Sound (Optional: Add a 'pop.mp3' in folder if you want sound, otherwise this is safe)
// const clickSound = new Audio('pop.mp3'); 

// --- Core Mechanics ---

// The Click Event
anthonyImg.addEventListener('mousedown', (e) => { // using mousedown for instant response
    // 1. Logic
    game.score += game.clickPower;
    
    // 2. Visual Effects
    triggerShockwave();
    createFloatingNumber(e.clientX, e.clientY, `+${formatNumber(game.clickPower)}`);
    
    // 3. Audio (Optional - Uncomment if you have a file)
    // clickSound.currentTime = 0;
    // clickSound.play();

    updateUI();
});

// Passive Income Loop (Runs 10 times a second for smoothness)
setInterval(() => {
    if (game.autoPerSecond > 0) {
        // Add 1/10th of the per-second value
        game.score += (game.autoPerSecond / 10);
        updateUI();
    }
}, 100);

// --- Visual Effects Functions ---

function triggerShockwave() {
    // Reset animation
    shockwave.classList.remove('ripple-animation');
    // Force a browser reflow (magic trick to restart animation)
    void shockwave.offsetWidth;
    // Start animation
    shockwave.classList.add('ripple-animation');
}

function createFloatingNumber(x, y, text) {
    const el = document.createElement('div');
    el.classList.add('floating-number');
    el.innerText = text;
    
    // Randomize position slightly for "organic" feel
    const randomX = (Math.random() - 0.5) * 40;
    el.style.left = `${x + randomX}px`;
    el.style.top = `${y - 20}px`;

    particlesContainer.appendChild(el);

    // Remove element after animation finishes (1 second)
    setTimeout(() => {
        el.remove();
    }, 1000);
}

// --- Shop Logic ---

function buyUpgrade(id) {
    const item = upgrades[id];
    
    if (game.score >= item.cost) {
        game.score -= item.cost;
        item.count++;
        
        // Increase Cost (1.5x multiplier)
        item.cost = Math.ceil(item.cost * 1.5);

        // Apply Benefit
        if (item.type === 'click') {
            game.clickPower += item.power;
        } else if (item.type === 'auto') {
            game.autoPerSecond += item.power;
        }

        updateUI();
    }
}

// --- Utility & UI ---

// Formats numbers (e.g., 1200 -> 1.2k)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return Math.floor(num); // No decimals for small numbers
}

function updateUI() {
    scoreEl.innerText = formatNumber(game.score);
    document.getElementById('per-click').innerText = formatNumber(game.clickPower);
    document.getElementById('per-second').innerText = formatNumber(game.autoPerSecond);

    // Update Shop Buttons
    updateShopButton('click', 'cost-click');
    updateShopButton('clone', 'cost-clone');
    updateShopButton('farm', 'cost-farm');
}

function updateShopButton(id, costId) {
    const item = upgrades[id];
    const btn = document.getElementById(`btn-${id}`);
    const costSpan = document.getElementById(costId);

    costSpan.innerText = formatNumber(item.cost);

    if (game.score >= item.cost) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// Init
updateUI();