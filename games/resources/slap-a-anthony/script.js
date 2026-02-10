/* --- 1. ADVANCED CONFIGURATION --- */
// Tweak these numbers to balance your game!
const upgrades = [
    // --- TIER 1: THE BEGINNING ---
    { 
        id: 'click1', 
        name: 'Finger Gym', 
        icon: '👆', 
        type: 'click',
        baseCost: 15,       
        basePower: 1,       
        costScale: 1.35,     // Kept low to encourage early clicking
        milestoneStep: 50,  
        milestoneMult: 2    
    },
    { 
        id: 'auto1', 
        name: 'Little Brother', 
        icon: '👶', 
        type: 'auto',
        baseCost: 50, 
        basePower: 1, 
        costScale: 1.15,    
        milestoneStep: 25, 
        milestoneMult: 2 
    },
    { 
        id: 'click2', 
        name: 'RGB Mouse', 
        icon: '🖱️', 
        type: 'click',
        baseCost: 350,      
        basePower: 8,       
        costScale: 1.45,    
        milestoneStep: 25,  
        milestoneMult: 2    
    },
    { 
        id: 'auto2', 
        name: 'Anthony Clone', 
        icon: '👯', 
        type: 'auto',
        baseCost: 600,        
        basePower: 10, 
        costScale: 1.15, 
        milestoneStep: 25, 
        milestoneMult: 2 
    },

    // --- TIER 2: ESTABLISHING THE BASE ---
    { 
        id: 'passive1', 
        name: 'Lucky Charm', 
        icon: '🍀', 
        type: 'passive', // Special Type: Adds Crit Chance
        baseCost: 1000, 
        basePower: 0,    
        effect: 0.01,    // Adds 1% Crit Chance per level
        costScale: 2.5,  // Very steep scaling (hard to max out)
        milestoneStep: 10, 
        milestoneMult: 1 
    },
    { 
        id: 'auto3', 
        name: 'Server Farm', 
        icon: '💻', 
        type: 'auto',
        baseCost: 3500, 
        basePower: 45, 
        costScale: 1.15,    
        milestoneStep: 100, // Harder milestone...
        milestoneMult: 5    // ...Big reward
    },
    { 
        id: 'auto4', 
        name: 'AI Generator', 
        icon: '🤖', 
        type: 'auto',
        baseCost: 12000, 
        basePower: 180, 
        costScale: 1.15, 
        milestoneStep: 25, 
        milestoneMult: 2 
    },
    { 
        id: 'click3', 
        name: 'Macro Script', 
        icon: '📜', 
        type: 'click',
        baseCost: 15000,    // Strategic choice: Buy this or AI Generator?
        basePower: 120,     
        costScale: 1.40,    
        milestoneStep: 50, 
        milestoneMult: 3    
    },

    // --- TIER 3: INDUSTRIAL EXPANSION ---
    { 
        id: 'auto5', 
        name: 'Quantum Core', 
        icon: '⚛️', 
        type: 'auto',
        baseCost: 85000, 
        basePower: 950, 
        costScale: 1.15, 
        milestoneStep: 25, 
        milestoneMult: 2 
    },
    { 
        id: 'auto6', 
        name: 'Alien Tech', 
        icon: '👽', 
        type: 'auto',
        baseCost: 1200000,   // 1.2 Million
        basePower: 6500, 
        costScale: 1.18, 
        milestoneStep: 10,  
        milestoneMult: 1.5  
    },
    { 
        id: 'click4', 
        name: 'Bionic Implant', 
        icon: '🦾', 
        type: 'click',
        baseCost: 2500000,  // 2.5 Million
        basePower: 8500,    
        costScale: 1.5,     
        milestoneStep: 10,  
        milestoneMult: 1.5  
    },

    // --- TIER 4: PLANETARY SCALE ---
    { 
        id: 'auto7', 
        name: 'Dyson Sphere', 
        icon: '☀️', 
        type: 'auto',
        baseCost: 25000000,  // 25 Million
        basePower: 45000, 
        costScale: 1.15, 
        milestoneStep: 50, 
        milestoneMult: 3 
    },
    { 
        id: 'auto8', 
        name: 'Reality Bender', 
        icon: '🌀', 
        type: 'auto',
        baseCost: 300000000, // 300 Million
        basePower: 220000, 
        costScale: 1.15, 
        milestoneStep: 25, 
        milestoneMult: 2 
    },
    { 
        id: 'click5', 
        name: 'Telekinetic Link', 
        icon: '🧠', 
        type: 'click',
        baseCost: 500000000, // 500 Million
        basePower: 500000,   // Massive active play reward
        costScale: 1.6,      // Luxury item scaling
        milestoneStep: 100, 
        milestoneMult: 10    
    },

    // --- TIER 5: COSMIC ENDGAME ---
    { 
        id: 'auto9', 
        name: 'Timeline Thief', 
        icon: '⏳', 
        type: 'auto',
        baseCost: 5000000000, // 5 Billion
        basePower: 1500000, 
        costScale: 1.20,      
        milestoneStep: 100, 
        milestoneMult: 10     
    },
    { 
        id: 'auto10', 
        name: 'Multiverse Simulation', 
        icon: '🌌', 
        type: 'auto',
        baseCost: 75000000000, // 75 Billion
        basePower: 12000000,   // 12 Million DPS
        costScale: 1.25,       
        milestoneStep: 10, 
        milestoneMult: 1.2     
    }
];

/* --- 2. GAME STATE --- */
let game = {
    score: 0,
    totalScore: 0, 
    prestigeLevel: 0,
    inventory: {} 
};

// Initialize Inventory
upgrades.forEach(u => {
    if(typeof game.inventory[u.id] === 'undefined') {
        game.inventory[u.id] = 0;
    }
});

/* --- 3. LOAD SAVE --- */
if(localStorage.getItem('anthonyUltimate')) {
    let saved = JSON.parse(localStorage.getItem('anthonyUltimate'));
    game = { ...game, ...saved };
    
    // Compatibility check for new items
    upgrades.forEach(u => {
        if(typeof game.inventory[u.id] === 'undefined') {
            game.inventory[u.id] = 0;
        }
    });
}

/* --- 4. DOM ELEMENTS --- */
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

/* --- 5. MATH LOGIC (THE BRAINS) --- */

// COST = Base * (Scale ^ Count)
const getCost = (id) => {
    const u = upgrades.find(x => x.id === id);
    const count = game.inventory[id];
    return Math.floor(u.baseCost * Math.pow(u.costScale, count));
};

// POWER PER UNIT = Base * (MilestoneMult ^ MilestonesReached) * Prestige
const getUnitPower = (id) => {
    const u = upgrades.find(x => x.id === id);
    const count = game.inventory[id];
    
    // 1. Calculate Milestones
    const milestonesReached = Math.floor(count / u.milestoneStep);
    const milestoneBonus = Math.pow(u.milestoneMult, milestonesReached);

    // 2. Calculate Prestige
    const prestigeMulti = 1 + (game.prestigeLevel * 0.1); // +10% per prestige

    return u.basePower * milestoneBonus * prestigeMulti;
};

// TOTAL PRODUCTION = UnitPower * Count
const getProduction = (id) => {
    return getUnitPower(id) * game.inventory[id];
};

const getGlobalPerSec = () => {
    let total = 0;
    upgrades.forEach(u => {
        if(u.type === 'auto') total += getProduction(u.id);
    });
    return total;
};

const getClickStrength = () => {
    let total = 1; // Base power (always 1)
    
    // Loop through ALL upgrades
    upgrades.forEach(u => {
        // If it's a click upgrade, add its power to the total
        if(u.type === 'click') {
            total += getProduction(u.id);
        }
    });

    return total;
};

/* --- 6. INTERACTION --- */

/* --- 6. INTERACTION --- */

els.anthony.addEventListener('mousedown', (e) => {
    // 1. Get Base Strength
    let amount = getClickStrength();

    // 2. Calculate Crit Chance (Lucky Charm logic)
    // We look for 'passive1' specifically, or loop for all passives
    const luckyCharmLevel = game.inventory['passive1'] || 0;
    const critChance = luckyCharmLevel * 0.01; // 1% per level

    // 3. Roll for Crit
    let text = `+${format(amount)}`;
    if (Math.random() < critChance) {
        amount *= 5; // 5x Damage on Crit
        text = `💥 CRIT! +${format(amount)}`;
    }

    addScore(amount);
    spawnFloater(e.clientX, e.clientY, text);
    
    // Animation reset trick
    els.bgPulse.classList.remove('pulse-anim');
    void els.bgPulse.offsetWidth; 
    els.bgPulse.classList.add('pulse-anim');
});

/* --- 7. SHOP SYSTEM --- */

function renderShop() {
    els.shop.innerHTML = '';
    
    upgrades.forEach((u, index) => {
        const cost = getCost(u.id);
        const count = game.inventory[u.id];
        const power = getUnitPower(u.id); // Power of the NEXT item you buy
        
        // Progress bar for next milestone
        const progress = (count % u.milestoneStep) / u.milestoneStep * 100;
        
        const card = document.createElement('div');
        card.id = `card-${index}`;
        card.className = `upgrade-card ${game.score >= cost ? 'affordable' : 'too-expensive'}`;
        
        card.innerHTML = `
            <div class="card-icon">${u.icon}</div>
            <div class="card-info">
                <div class="card-name">${u.name}</div>
                <div class="card-details">
                    +${format(power)} ${u.type === 'click' ? '/click' : '/sec'}
                    <br><span style="font-size:0.75em; opacity:0.7">Next x${u.milestoneMult} at level ${Math.floor(count/u.milestoneStep + 1) * u.milestoneStep}</span>
                </div>
                <div class="card-cost">💰 ${format(cost)}</div>
            </div>
            <div class="card-level">${count}</div>
            <div class="milestone-progress">
                <div class="milestone-fill" style="width: ${progress}%"></div>
            </div>
        `;
        
        card.onclick = (e) => buyUpgrade(u.id, e);
        els.shop.appendChild(card);
    });
}

function buyUpgrade(id, event) {
    const cost = getCost(id);
    if(game.score >= cost) {
        game.score -= cost;
        game.inventory[id]++;
        
        renderShop();
        updateUI();

        // Visual Shake
        if(event && event.currentTarget) {
            const card = event.currentTarget;
            card.style.transform = "scale(0.95)";
            setTimeout(() => card.style.transform = "scale(1)", 100);
        }
    }
}

/* --- 8. UI & VISUALS --- */

function updateUI() {
    // Score
    els.score.innerText = format(game.score);
    els.perSec.innerText = format(getGlobalPerSec());
    
    // Prestige Button
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

    // Badge
    if(game.prestigeLevel > 0) {
        els.prestigeBadge.style.display = 'block';
        els.prestigeLvl.innerText = game.prestigeLevel;
        els.prestigeBoost.innerText = (game.prestigeLevel * 10);
    }

    updateShopColors();
}

function updateShopColors() {
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
    
    if(confirm(`ASCEND? \n\nCurrent Bonus: +${game.prestigeLevel * 10}%\nNew Bonus: +${(game.prestigeLevel+1) * 10}%`)) {
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
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
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

/* --- MODAL LOGIC --- */

// 1. Opens the menu (Called by the Wipe button)
function hardReset() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('hidden');
}

// 2. Closes the menu (Called by the Cancel button)
function closeModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('hidden');
}

// 3. Actually deletes the save (Called by the Confirm button)
function confirmWipe() {
    localStorage.removeItem('anthonyUltimate');
    
    // Optional: Add a visual effect or small delay before reload
    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;color:red;font-size:2rem;font-family:sans-serif;">WIPING DATA...</div>';
    
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Start
renderShop();
updateUI();