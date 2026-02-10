// --- CONFIGURATION ---
// Add as many upgrades as you want here!
const upgradeData = [
    // Click Upgrades (type: 'click')
    { id: 'u1', name: 'Workout', icon: '💪', baseCost: 15, increase: 1, type: 'click', desc: '+1 Click Power' },
    { id: 'u2', name: 'Energy Drink', icon: '⚡', baseCost: 100, increase: 5, type: 'click', desc: '+5 Click Power' },
    { id: 'u3', name: 'Golden Mouse', icon: '🖱️', baseCost: 500, increase: 15, type: 'click', desc: '+15 Click Power' },
    { id: 'u4', name: 'Cybernetic Arm', icon: '🦾', baseCost: 2000, increase: 50, type: 'click', desc: '+50 Click Power' },

    // Auto Upgrades (type: 'auto')
    { id: 'a1', name: 'Clone', icon: '👯', baseCost: 50, increase: 1, type: 'auto', desc: '+1 / sec' },
    { id: 'a2', name: 'Farm', icon: '🚜', baseCost: 350, increase: 5, type: 'auto', desc: '+5 / sec' },
    { id: 'a3', name: 'Factory', icon: '🏭', baseCost: 1500, increase: 20, type: 'auto', desc: '+20 / sec' },
    { id: 'a4', name: 'Bank', icon: '🏦', baseCost: 5000, increase: 75, type: 'auto', desc: '+75 / sec' },
    { id: 'a5', name: 'Temple', icon: '🕌', baseCost: 25000, increase: 200, type: 'auto', desc: '+200 / sec' },
    
    // Special Upgrades (type: 'crit')
    { id: 's1', name: 'Lucky Clover', icon: '🍀', baseCost: 1000, increase: 0.05, type: 'crit', desc: '+5% Crit Chance' },
];

// --- GAME STATE ---
let game = {
    score: 0,
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalClicks: 0,
    inventory: {} // Stores how many of each upgrade we have: { 'u1': 5, 'a1': 2 }
};

// --- INIT ---
// Initialize inventory count to 0 for all items
upgradeData.forEach(item => {
    if (!game.inventory[item.id]) game.inventory[item.id] = 0;
});

// Load Save if exists
if (localStorage.getItem('anthonySave')) {
    const saved = JSON.parse(localStorage.getItem('anthonySave'));
    // Merge save with current structure (prevents errors if you add new items later)
    game = { ...game, ...saved };
}

// --- DOM ELEMENTS ---
const els = {
    score: document.getElementById('score'),
    anthony: document.getElementById('anthony-face'),
    shop: document.getElementById('shop-container'),
    particles: document.getElementById('particles-container'),
    shockwave: document.getElementById('shockwave'),
    level: document.getElementById('level-val'),
    xpBar: document.getElementById('xp-bar'),
    statClick: document.getElementById('stat-click'),
    statAuto: document.getElementById('stat-auto'),
    statCrit: document.getElementById('stat-crit'),
};

// --- CORE MECHANICS ---

function getClickPower() {
    let power = 1;
    upgradeData.forEach(u => {
        if (u.type === 'click') power += (game.inventory[u.id] * u.increase);
    });
    return power;
}

function getAutoPerSec() {
    let auto = 0;
    upgradeData.forEach(u => {
        if (u.type === 'auto') auto += (game.inventory[u.id] * u.increase);
    });
    return auto;
}

function getCritChance() {
    let chance = 0; // 0% base
    upgradeData.forEach(u => {
        if (u.type === 'crit') chance += (game.inventory[u.id] * u.increase);
    });
    return Math.min(chance, 0.5); // Cap at 50%
}

function getCost(item) {
    // Cost increases by 15% per level owned
    return Math.floor(item.baseCost * Math.pow(1.15, game.inventory[item.id]));
}

// --- INTERACTION ---

els.anthony.addEventListener('mousedown', (e) => {
    // 1. Calculate Damage
    let damage = getClickPower();
    let isCrit = Math.random() < getCritChance();
    
    if (isCrit) damage *= 10; // Criticals do 10x damage!

    // 2. Add Score
    addScore(damage);
    game.totalClicks++;

    // 3. Visuals
    spawnFloatingText(e.clientX, e.clientY, `+${formatNum(damage)}`, isCrit);
    triggerShockwave();
});

function addScore(amount) {
    game.score += amount;
    game.xp += amount;
    
    // Level Up Logic
    if (game.xp >= game.xpToNext) {
        game.level++;
        game.xp = 0;
        game.xpToNext = Math.floor(game.xpToNext * 1.5);
        // Bonus for leveling up
        spawnFloatingText(window.innerWidth/2, window.innerHeight/2, "LEVEL UP!", true);
    }
    updateUI();
}

// Auto Clicker Loop (Runs 10x a second)
setInterval(() => {
    const aps = getAutoPerSec();
    if (aps > 0) {
        addScore(aps / 10);
    }
    // Auto Save every 5 seconds
    if (new Date().getSeconds() % 5 === 0) saveGame();
}, 100);


// --- SHOP SYSTEM ---

function renderShop() {
    els.shop.innerHTML = ""; // Clear list
    
    upgradeData.forEach(item => {
        const cost = getCost(item);
        const count = game.inventory[item.id];
        
        const btn = document.createElement('div');
        btn.className = 'shop-item';
        if (game.score < cost) btn.classList.add('locked');
        else btn.classList.add('unlocked');

        btn.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-details">
                <div class="item-name">${item.name} <span class="item-level">Lvl ${count}</span></div>
                <div class="item-desc">${item.desc}</div>
                <div class="item-cost">${formatNum(cost)} Anthonys</div>
            </div>
        `;

        btn.onclick = () => buyItem(item);
        els.shop.appendChild(btn);
    });
}

function buyItem(item) {
    const cost = getCost(item);
    if (game.score >= cost) {
        game.score -= cost;
        game.inventory[item.id]++;
        updateUI();
    }
}

// --- VISUALS ---

function spawnFloatingText(x, y, text, isCrit) {
    const el = document.createElement('div');
    el.className = 'floater';
    if (isCrit) el.classList.add('crit');
    el.innerText = text;
    
    // Randomize position slightly
    const rx = (Math.random() - 0.5) * 40;
    const ry = (Math.random() - 0.5) * 40;
    
    el.style.left = `${x + rx}px`;
    el.style.top = `${y + ry}px`;
    
    els.particles.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function triggerShockwave() {
    els.shockwave.classList.remove('pulse');
    void els.shockwave.offsetWidth; // Magic reset
    els.shockwave.classList.add('pulse');
}

function formatNum(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return Math.floor(num);
}

function updateUI() {
    // Score & Level
    els.score.innerText = formatNum(game.score);
    els.level.innerText = game.level;
    
    const xpPercent = (game.xp / game.xpToNext) * 100;
    els.xpBar.style.width = `${xpPercent}%`;

    // Stats
    els.statClick.innerText = formatNum(getClickPower());
    els.statAuto.innerText = formatNum(getAutoPerSec());
    els.statCrit.innerText = Math.floor(getCritChance() * 100) + '%';

    // Refresh Shop
    renderShop();
}

function saveGame() {
    localStorage.setItem('anthonySave', JSON.stringify(game));
}

function resetGame() {
    if(confirm("Wipe save?")) {
        localStorage.removeItem('anthonySave');
        location.reload();
    }
}

// Start
updateUI();