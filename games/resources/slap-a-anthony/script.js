// Game State
let score = 0;
let clickPower = 1;
let autoClickPower = 0;

// Upgrade Costs
let clickUpgradeCost = 10;
let autoClickerCost = 50;

// DOM Elements
const scoreEl = document.getElementById('score');
const perClickEl = document.getElementById('per-click');
const perSecondEl = document.getElementById('per-second');
const anthonyImg = document.getElementById('anthony-face');

const clickCostEl = document.getElementById('cost-click');
const autoCostEl = document.getElementById('cost-auto');
const clickBtn = document.getElementById('btn-upgrade-click');
const autoBtn = document.getElementById('btn-upgrade-auto');

// Event Listener for Clicking Anthony
anthonyImg.addEventListener('click', () => {
    addToScore(clickPower);
});

// Function to add score and update UI
function addToScore(amount) {
    score += amount;
    updateUI();
}

// Upgrade 1: Increase Click Power
function buyClickUpgrade() {
    if (score >= clickUpgradeCost) {
        score -= clickUpgradeCost;
        clickPower += 1;             // Increase power by 1
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5); // Increase cost by 50%
        
        updateUI();
    }
}

// Upgrade 2: Buy Auto Clicker
function buyAutoClicker() {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickPower += 1;         // Increase auto clicks by 1 per sec
        autoClickerCost = Math.floor(autoClickerCost * 1.5); // Increase cost by 50%
        
        updateUI();
    }
}

// The Game Loop (Runs once every second for passive income)
setInterval(() => {
    if (autoClickPower > 0) {
        addToScore(autoClickPower);
    }
}, 1000);

// Update the User Interface
function updateUI() {
    // Update text
    scoreEl.innerText = score;
    perClickEl.innerText = clickPower;
    perSecondEl.innerText = autoClickPower;
    clickCostEl.innerText = clickUpgradeCost;
    autoCostEl.innerText = autoClickerCost;

    // Enable/Disable buttons based on affordability
    clickBtn.disabled = score < clickUpgradeCost;
    autoBtn.disabled = score < autoClickerCost;
}

// Initial UI load
updateUI();