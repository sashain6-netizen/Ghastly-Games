/* --- CONFIGURATION --- */
const upgrades = [
    { id: 'click', name: 'Click Strength', icon: '👆', baseCost: 15, basePower: 1, type: 'click' },
    { id: 'auto1', name: 'Little Brother', icon: '👶', baseCost: 50, basePower: 1, type: 'auto' },
    { id: 'auto2', name: 'Anthony Clone', icon: '👯', baseCost: 500, basePower: 10, type: 'auto' },
    { id: 'auto3', name: 'Server Farm', icon: '💻', baseCost: 2500, basePower: 50, type: 'auto' },
    { id: 'auto4', name: 'AI Generator', icon: '🤖', baseCost: 10000, basePower: 200, type: 'auto' },
    { id: 'auto5', name: 'Quantum Anthony', icon: '⚛️', baseCost: 100000, basePower: 1500, type: 'auto' },
    { id: 'auto6', name: 'Alien Planet', icon: '🪐', baseCost: 1000000, basePower: 10000, type: 'auto' },
];

/* --- GAME STATE --- */
let game = {
    score: 0,
    totalScore: 0, // Lifetime earnings (for prestige)
    prestigeLevel: 0,
    inventory: {} // { 'auto1': 5, 'auto2': 10 }
};

// Initialize Inventory
upgrades.forEach(u => game.inventory[u.id] = 0);

/* --- LOAD SAVE --- */
if(localStorage.getItem('anthonyUltimate')) {
    let saved = JSON.parse(localStorage.getItem('anthonyUltimate'));
    game = { ...game, ...saved }; // Merge to keep compatibility
}

/* --- DOM ELEMENTS --- */
const els = {
    score: document.getElementById('score'),
    perSec: document.getElementById('per-sec'),
    anthony: document.getElementById('anthony-btn'),
    shop: document.getElementById('shop-list'),
    bgPulse: document.querySelector('.ripple-bg'),
    particles: document.getElementById('particles'),
    ascendBtn: document.getElementById('ascend-btn'),
    prestigeBadge: document.getElementById('prestige-badge'),
    prestigeLvl: document.getElementById('prestige-level'),
    prestigeBoost: document.getElementById('prestige-boost')
};

/* --- CORE LOGIC --- */

// Calculate Cost: Base * 1.15^Count
const getCost = (id) => {
    const u = upgrades.find(x => x.id === id);
    return Math.floor(u.baseCost * Math.pow(1.15, game.inventory[id]));
};

// Calculate Power: Base * Multipliers * Prestige
const getPower = (id) => {
    const u = upgrades.find(x => x.id === id);
    const count = game.inventory[id];
    
    // Milestone Bonus: Every 25 levels, power doubles
    const multiplier = Math.pow(2, Math.floor(count / 25));
    
    // Prestige Bonus: +10% per prestige level
    const prestigeMulti = 1 + (game.prestigeLevel * 0.1);
    
    return u.basePower * multiplier * prestigeMulti;
};

const getClickPower = () => {
    let base = 1 + (game.inventory['click'] * getPower('click')); // Base 1 click
    return base;
};

const getAutoProduction = () => {
    let total = 0;
    upgrades.forEach(u => {
        if(u.type === 'auto') {
            total += game.inventory[u.id] * getPower(u.id);
        }
    });
    return total;
};

/* --- INTERACTION --- */

els.anthony.addEventListener('mousedown', (e) => {
    const amount = getClickPower();
    addScore(amount);
    spawnFloater(e.clientX, e.clientY, `+${format(amount)}`);
    
    // Visuals
    els.bgPulse.classList.remove('pulse-anim');
    void els.bgPulse.offsetWidth; // reset animation
    els.bgPulse.classList.add('pulse-anim');
});

function addScore(amount) {
    game.score += amount;
    game.totalScore += amount;
    updateUI();
}

// Main Loop (10 ticks per second)
setInterval(() => {
    const auto = getAutoProduction();
    if(auto > 0) {
        addScore(auto / 10);
    }
}, 100);

// Auto-Save Loop
setInterval(() => saveGame(false), 10000); 

/* --- SHOP SYSTEM --- */

function renderShop() {
    els.shop.innerHTML = '';
    
    upgrades.forEach(u => {
        const cost = getCost(u.id);
        const count = game.inventory[u.id];
        const power = getPower(u.id);
        
        // Milestone progress (0 to 25)
        const progress = (count % 25) / 25 * 100;
        
        const card = document.createElement('div');
        card.className = `upgrade-card ${game.score >= cost ? 'affordable' : 'too-expensive'}`;
        
        card.innerHTML = `
            <div class="card-icon">${u.icon}</div>
            <div class="card-info">
                <div class="card-name">${u.name}</div>
                <div class="card-details">Effect: +${format(power)} ${u.type === 'click' ? '/click' : '/sec'}</div>
                <div class="card-cost">💰 ${format(cost)}</div>
            </div>
            <div class="card-level">${count}</div>
            <div class="milestone-progress">
                <div class="milestone-fill" style="width: ${progress}%"></div>
            </div>
        `;
        
        card.onclick = () => buyUpgrade(u.id);
        els.shop.appendChild(card);
    });
}

function buyUpgrade(id) {
    const cost = getCost(id);
    if(game.score >= cost) {
        game.score -= cost;
        game.inventory[id]++;
        updateUI(); // Re-render to update costs and affordability
    }
}

/* --- PRESTIGE SYSTEM --- */
function triggerAscension() {
    if(game.score < 1000000) return;
    
    if(confirm("ASCEND? You will lose upgrades but gain +10% permanent bonus per level!")) {
        game.prestigeLevel++;
        game.score = 0;
        // Reset inventory
        for(let key in game.inventory) game.inventory[key] = 0;
        saveGame(true);
        location.reload();
    }
}

/* --- VISUALS & UTILS --- */

function updateUI() {
    els.score.innerText = format(game.score);
    els.perSec.innerText = format(getAutoProduction());
    
    // Prestige Button
    if(game.totalScore > 500000) { // Show button when close
        els.ascendBtn.style.display = 'block';
        if(game.score >= 1000000) {
            els.ascendBtn.classList.remove('locked');
            els.ascendBtn.innerText = "🌀 ASCEND NOW!";
        } else {
            els.ascendBtn.classList.add('locked');
        }
    } else {
        els.ascendBtn.style.display = 'none';
    }

    // Prestige Badge
    if(game.prestigeLevel > 0) {
        els.prestigeBadge.style.display = 'block';
        els.prestigeLvl.innerText = game.prestigeLevel;
        els.prestigeBoost.innerText = (game.prestigeLevel * 10);
    }

    // Only re-render shop if interaction happened (optimization)
    // For simplicity in this script, we just re-render class status
    // A full React/Vue app would do this better, but here we just re-render:
    renderShop(); 
}

function spawnFloater(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floater';
    el.innerText = text;
    el.style.left = `${x}px`;
    el.style.top = `${y - 50}px`;
    el.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`; // Rainbow colors
    els.particles.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function format(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
    return Math.floor(num);
}

function saveGame(notify) {
    localStorage.setItem('anthonyUltimate', JSON.stringify(game));
    if(notify) {
        const t = document.getElementById('toast');
        t.classList.remove('hidden');
        setTimeout(() => t.classList.add('hidden'), 2000);
    }
}

function hardReset() {
    if(confirm("Delete save file permanently?")) {
        localStorage.removeItem('anthonyUltimate');
        location.reload();
    }
}

// Initial Kickoff
updateUI();