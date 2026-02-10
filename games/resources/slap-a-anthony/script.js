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
    inventory: {} 
};

// Initialize Inventory
upgrades.forEach(u => {
    // If the item doesn't exist in inventory (new update or fresh save), set to 0
    if(typeof game.inventory[u.id] === 'undefined') {
        game.inventory[u.id] = 0;
    }
});

/* --- LOAD SAVE --- */
if(localStorage.getItem('anthonyUltimate')) {
    let saved = JSON.parse(localStorage.getItem('anthonyUltimate'));
    game = { ...game, ...saved };
    
    // Safety check: ensure any new upgrades added to code exist in the loaded save
    upgrades.forEach(u => {
        if(typeof game.inventory[u.id] === 'undefined') {
            game.inventory[u.id] = 0;
        }
    });
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

const getCost = (id) => {
    const u = upgrades.find(x => x.id === id);
    return Math.floor(u.baseCost * Math.pow(1.15, game.inventory[id]));
};

const getPower = (id) => {
    const u = upgrades.find(x => x.id === id);
    const count = game.inventory[id];
    
    // Milestone Bonus: Power doubles every 25 levels
    const multiplier = Math.pow(2, Math.floor(count / 25));
    
    // Prestige Bonus: +10% per prestige level
    const prestigeMulti = 1 + (game.prestigeLevel * 0.1);
    
    return u.basePower * multiplier * prestigeMulti;
};

const getClickPower = () => {
    let base = 1 + (game.inventory['click'] * getPower('click'));
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
    void els.bgPulse.offsetWidth; // Force reflow
    els.bgPulse.classList.add('pulse-anim');
});

function addScore(amount) {
    game.score += amount;
    game.totalScore += amount;
    // We do NOT call updateUI here constantly to save performance.
    // The loop handles the UI.
}

// Main Loop (10 ticks per second)
setInterval(() => {
    const auto = getAutoProduction();
    if(auto > 0) {
        // Add 1/10th of per-second production
        game.score += (auto / 10);
        game.totalScore += (auto / 10);
    }
    updateUI(); // Updates the text and button colors
}, 100);

// Auto-Save Loop (Every 10 seconds)
setInterval(() => saveGame(false), 10000); 

/* --- SHOP SYSTEM --- */

function renderShop() {
    els.shop.innerHTML = '';
    
    upgrades.forEach((u, index) => {
        const cost = getCost(u.id);
        const count = game.inventory[u.id];
        const power = getPower(u.id);
        
        // Milestone progress (0 to 25)
        const progress = (count % 25) / 25 * 100;
        
        const card = document.createElement('div');
        // We add an ID to the card so we can find it later easily
        card.id = `card-${index}`;
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
        
        // Pass the event so we can shake the specific card
        card.onclick = (e) => buyUpgrade(u.id, e);
        els.shop.appendChild(card);
    });
}

function buyUpgrade(id, event) {
    const cost = getCost(id);
    if(game.score >= cost) {
        game.score -= cost;
        game.inventory[id]++;
        
        // Re-render shop because costs and levels changed
        renderShop();
        updateUI();

        // Visual Feedback: Shake the card that was clicked
        if(event && event.currentTarget) {
            const card = event.currentTarget;
            card.style.transform = "scale(0.95)";
            setTimeout(() => card.style.transform = "scale(1)", 100);
        }
    }
}

/* --- VISUALS & UTILS --- */

function updateUI() {
    // 1. Update Texts
    els.score.innerText = format(game.score);
    els.perSec.innerText = format(getAutoProduction());
    
    // 2. Prestige Button Logic
    if(game.totalScore > 500000) {
        els.ascendBtn.style.display = 'block';
        if(game.score >= 1000000) {
            els.ascendBtn.classList.remove('locked');
            els.ascendBtn.innerText = "🌀 ASCEND NOW!";
        } else {
            els.ascendBtn.classList.add('locked');
            els.ascendBtn.innerText = "🌀 ASCEND (Req: 1M)";
        }
    } else {
        els.ascendBtn.style.display = 'none';
    }

    // 3. Prestige Badge
    if(game.prestigeLevel > 0) {
        els.prestigeBadge.style.display = 'block';
        els.prestigeLvl.innerText = game.prestigeLevel;
        els.prestigeBoost.innerText = (game.prestigeLevel * 10);
    }

    // 4. Update Shop Colors (Lightweight)
    updateShopVisuals();
}

// Optimized: Only toggles classes, doesn't rebuild HTML
function updateShopVisuals() {
    upgrades.forEach((u, index) => {
        const card = document.getElementById(`card-${index}`);
        if(!card) return;
        
        const cost = getCost(u.id);
        if(game.score >= cost) {
            card.classList.add('affordable');
            card.classList.remove('too-expensive');
        } else {
            card.classList.remove('affordable');
            card.classList.add('too-expensive');
        }
    });
}

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

function spawnFloater(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floater';
    el.innerText = text;
    el.style.left = `${x}px`;
    el.style.top = `${y - 50}px`;
    el.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`; 
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

// Initial Render
renderShop();
updateUI();