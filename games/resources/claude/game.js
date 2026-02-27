/* =============================================
   ECHOES OF THE HOLLOW KING — GAME ENGINE
   ============================================= */

'use strict';

// ─── UTILITIES ───────────────────────────────
const $ = id => document.getElementById(id);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function flash() {
  const el = document.createElement('div');
  el.className = 'transition-flash';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 400);
}

function showDamage(value, type, x, y) {
  const el = document.createElement('div');
  el.className = `damage-float dmg-${type}`;
  const text = type === 'miss' ? 'MISS' : type === 'heal' ? `+${value}` : `-${value}`;
  el.textContent = text;
  el.style.left = `${x - 30}px`;
  el.style.top = `${y - 20}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ─── SCREEN MANAGER ──────────────────────────
const Screen = {
  current: null,
  show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = $(`screen-${id}`);
    if (screen) screen.classList.add('active');
    this.current = id;
  }
};

// ─── GAME STATE ──────────────────────────────
const G = {
  player: null,
  currentEnemy: null,
  currentScene: 0,
  currentBattle: 0,
  combatTurn: 'player',
  combatLocked: false,
  storyPhase: 0,
  storyNode: null,
  typingTimer: null,
  battleNumber: 0,
};

// ─── PLAYER DATA ─────────────────────────────
function createPlayer() {
  return {
    name: 'KAEL',
    hp: 120, maxHp: 120,
    mp: 50, maxMp: 50,
    atk: 22, def: 12, spd: 15,
    level: 1, xp: 0, xpNext: 100,
    gold: 0,
    statuses: [],
    items: [
      { name: 'Ash Salve', desc: 'Restores 40 HP', count: 3, type: 'heal', value: 40 },
      { name: 'Ember Shard', desc: 'Restores 25 MP', count: 2, type: 'mp', value: 25 },
    ],
    skills: [
      {
        id: 'ember_slash',
        name: 'Ember Slash',
        icon: '🔥',
        desc: 'A blazing sword strike',
        cost: 12,
        type: 'attack',
        multiplier: 1.8,
        effect: 'burn',
        effectChance: 0.4,
      },
      {
        id: 'ash_veil',
        name: 'Ash Veil',
        icon: '🌑',
        desc: 'Raise defense this turn',
        cost: 8,
        type: 'buff',
        stat: 'guard',
        value: 0.4,
      },
      {
        id: 'hollow_pierce',
        name: 'Hollow Pierce',
        icon: '⚔️',
        desc: 'Ignores enemy defense',
        cost: 18,
        type: 'pierce',
        multiplier: 1.5,
      },
      {
        id: 'cinder_pulse',
        name: 'Cinder Pulse',
        icon: '💥',
        desc: 'Area burst, high crit',
        cost: 22,
        type: 'attack',
        multiplier: 2.2,
        critBonus: 0.35,
      },
      {
        id: 'flame_ward',
        name: 'Flame Ward',
        icon: '🛡️',
        desc: 'Heal 30 HP + regen',
        cost: 20,
        type: 'heal',
        value: 30,
        effect: 'regen',
      },
      {
        id: 'soul_drain',
        name: 'Soul Drain',
        icon: '🌀',
        desc: 'Drains HP and MP',
        cost: 15,
        type: 'drain',
        multiplier: 1.2,
      },
    ],
  };
}

// ─── ENEMY ROSTER ────────────────────────────
const ENEMY_ROSTER = [
  {
    id: 'void_shade',
    name: 'VOID SHADE',
    art: '👁️',
    hp: 85, maxHp: 85,
    atk: 16, def: 8, spd: 12,
    xp: 40, gold: 15,
    statuses: [],
    lore: 'A fragment of the Hollow King\'s fractured will, given form by ambient darkness.',
    deathLine: 'The shade lets out a soundless scream as the ember blade consumes it.',
    intro: 'Something stirs in the ash... A Void Shade coalesces from the darkness!',
    actions: ['strike', 'shadow_claw', 'flee_attempt'],
    drops: ['Ash Salve'],
  },
  {
    id: 'bone_herald',
    name: 'BONE HERALD',
    art: '💀',
    hp: 130, maxHp: 130,
    atk: 22, def: 14, spd: 10,
    xp: 75, gold: 28,
    statuses: [],
    lore: 'Once a royal messenger. Now it carries only silence.',
    deathLine: 'The Bone Herald crumbles to dust. A faint memory of its former life dissolves with it.',
    intro: 'The rattle of hollow bones echoes. A Bone Herald blocks your path!',
    actions: ['strike', 'death_knell', 'bone_ward', 'strike', 'strike'],
    drops: ['Ember Shard'],
  },
  {
    id: 'echo_knight',
    name: 'ECHO KNIGHT',
    art: '⚔️',
    hp: 180, maxHp: 180,
    atk: 28, def: 20, spd: 14,
    xp: 120, gold: 50,
    statuses: [],
    lore: 'The king\'s finest warrior, echoing endlessly in death.',
    deathLine: 'The Echo Knight staggers. For a moment you see the real face beneath the armor — a young soldier, finally at peace.',
    intro: 'Heavy armored footsteps shake the earth. The Echo Knight stands before you!',
    actions: ['heavy_strike', 'shield_slam', 'strike', 'battle_cry', 'heavy_strike'],
    drops: ['Ash Salve'],
  },
  {
    id: 'memory_witch',
    name: 'MEMORY WITCH',
    art: '🔮',
    hp: 145, maxHp: 145,
    atk: 30, def: 10, spd: 18,
    xp: 100, gold: 40,
    statuses: [],
    lore: 'She feeds on the memories of the dying, weaving them into terrible power.',
    deathLine: 'The Memory Witch shrieks as her stolen memories pour free, flickering like candles in rain.',
    intro: 'The air fills with whispers of the dead. A Memory Witch emerges from the void!',
    actions: ['mind_shatter', 'steal_memory', 'hex_strike', 'mind_shatter', 'strike'],
    drops: ['Ember Shard'],
  },
  {
    id: 'hollow_king',
    name: 'THE HOLLOW KING',
    art: '👑',
    hp: 320, maxHp: 320,
    atk: 40, def: 25, spd: 16,
    xp: 999, gold: 200,
    statuses: [],
    lore: 'King Malachar, unmade and remade by darkness. The throne of ash is his flesh.',
    deathLine: 'The Hollow King\'s crown cracks. Light — real, warm, golden light — pours through the fractures. He speaks one final word: "...free."',
    intro: 'The throne room falls utterly silent. Then: a sound like the world exhaling. THE HOLLOW KING RISES.',
    actions: ['hollow_strike', 'void_crush', 'soul_harvest', 'hollow_strike', 'dark_edict', 'void_crush'],
    isBoss: true,
    drops: [],
  },
];

// ─── ENEMY ACTIONS ───────────────────────────
const ENEMY_ACTIONS = {
  strike: {
    name: 'strikes',
    multi: 1.0,
    type: 'physical',
  },
  shadow_claw: {
    name: 'slashes with shadow claws',
    multi: 1.3,
    type: 'physical',
    effect: 'weaken',
    effectChance: 0.3,
  },
  flee_attempt: {
    name: 'attempts to flee but cannot',
    multi: 0,
    type: 'special',
    log: 'sys',
  },
  death_knell: {
    name: 'sounds the death knell',
    multi: 1.5,
    type: 'magical',
    effect: 'chill',
    effectChance: 0.5,
  },
  bone_ward: {
    name: 'raises a bone ward',
    multi: 0,
    type: 'buff',
    buff: 'guard',
  },
  heavy_strike: {
    name: 'delivers a crushing blow',
    multi: 1.6,
    type: 'physical',
  },
  shield_slam: {
    name: 'slams with the shield',
    multi: 1.2,
    type: 'physical',
    effect: 'stun',
    effectChance: 0.25,
  },
  battle_cry: {
    name: 'lets out a battle cry',
    multi: 0,
    type: 'buff',
    buff: 'atk_up',
  },
  mind_shatter: {
    name: 'shatters your mind',
    multi: 1.4,
    type: 'magical',
    effect: 'weaken',
    effectChance: 0.6,
  },
  steal_memory: {
    name: 'steals a memory',
    multi: 0.8,
    type: 'drain',
  },
  hex_strike: {
    name: 'hexes and strikes',
    multi: 1.5,
    type: 'magical',
    effect: 'burn',
    effectChance: 0.4,
  },
  hollow_strike: {
    name: 'strikes with hollow power',
    multi: 1.8,
    type: 'physical',
  },
  void_crush: {
    name: 'crushes with void energy',
    multi: 2.0,
    type: 'magical',
    effect: 'weaken',
    effectChance: 0.7,
  },
  soul_harvest: {
    name: 'harvests your soul essence',
    multi: 1.2,
    type: 'drain',
    effect: 'chill',
    effectChance: 0.5,
  },
  dark_edict: {
    name: 'issues a dark edict',
    multi: 1.6,
    type: 'magical',
    effect: 'burn',
    effectChance: 0.8,
  },
};

// ─── BATTLE SEQUENCE ─────────────────────────
const BATTLE_SEQUENCE = [
  { enemy: 'void_shade',    storyBefore: 'before_first_battle',  storyAfter: 'after_first_battle' },
  { enemy: 'bone_herald',   storyBefore: 'before_second_battle', storyAfter: 'after_second_battle' },
  { enemy: 'memory_witch',  storyBefore: 'before_third_battle',  storyAfter: 'after_third_battle' },
  { enemy: 'echo_knight',   storyBefore: 'before_fourth_battle', storyAfter: 'after_fourth_battle' },
  { enemy: 'hollow_king',   storyBefore: 'before_final_battle',  storyAfter: 'ending' },
];

// ─── STORY DATA ──────────────────────────────
const STORIES = {
  intro: [
    { speaker: 'NARRATOR', art: '🌑', text: 'Three hundred years of silence. The road to Vaelthorn is paved with the bones of those who came before.', choices: null },
    { speaker: 'NARRATOR', art: '🌑', text: 'You walk through the Fields of Ash. The ember blade at your hip pulses with a faint, stubborn warmth.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: '...Mira. I\'ll finish what you started. I swear it on the last flame.', choices: null },
    {
      speaker: 'NARRATOR', art: '🌑',
      text: 'A sound. Wrong and wrong and wrong — like silence given teeth. Something stirs in the ash ahead.',
      choices: [
        { text: '→ Draw the Ember Blade', next: 'before_first_battle' },
        { text: '→ Hold your ground and wait', next: 'before_first_battle' },
      ]
    },
  ],

  before_first_battle: [
    { speaker: 'NARRATOR', art: '👁️', text: 'A shape tears itself free of the darkness — formless, hungry, wrong. It turns its not-eyes toward you.', choices: null },
    { speaker: 'VOID SHADE', art: '👁️', text: '...aaaaashwalkerrr... the King... expects... your... SOUL...', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'Then he\'ll be disappointed. I\'m keeping it.', choices: null },
  ],
  after_first_battle: [
    { speaker: 'NARRATOR', art: '🌑', text: 'The shade dissolves. The ember blade drinks its fading essence and glows brighter.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'First blood. Or... first ash, I suppose.', choices: null },
    { speaker: 'NARRATOR', art: '🌑', text: 'You press deeper into the ruined outskirts of Vaelthorn. The architecture grows more wrong the further you go.', choices: null },
  ],

  before_second_battle: [
    { speaker: 'NARRATOR', art: '🌑', text: 'The bones of the old market district. Stalls still set, goods still displayed — as if time simply... stopped.', choices: null },
    { speaker: 'NARRATOR', art: '💀', text: 'A rattling. A clattering. Something assembles itself from the bones of those who never left.', choices: null },
    { speaker: 'BONE HERALD', art: '💀', text: '*clack* *clack* HEAR YE — BY DECREE OF THE HOLLOW KING — ALL LIVING — ARE HEREBY — TRESPASSERS —', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'Still delivering messages after three hundred years. That\'s dedication, at least.', choices: null },
  ],
  after_second_battle: [
    { speaker: 'NARRATOR', art: '🌑', text: 'The Bone Herald falls silent for the first time in centuries. You wonder if, somewhere, it feels relief.', choices: null },
    {
      speaker: 'KAEL', art: '⚔️',
      text: 'There\'s a way through the old palace gardens. But also through the cathedral. Which do I know better?',
      choices: [
        { text: '→ The gardens — nature always finds a way', next: 'before_third_battle' },
        { text: '→ The cathedral — high ground is advantageous', next: 'before_third_battle' },
      ]
    },
  ],

  before_third_battle: [
    { speaker: 'NARRATOR', art: '🌑', text: 'The air here is thick with whispers. Stolen memories, circling like moths around a dead flame.', choices: null },
    { speaker: 'NARRATOR', art: '🔮', text: 'She was once the royal archivist. Now she collects only the last thoughts of the dying.', choices: null },
    { speaker: 'MEMORY WITCH', art: '🔮', text: 'Oh... a new one. I can already taste your memories... your teacher\'s death... your grief... exquisite.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'Those memories are MINE.', choices: null },
    { speaker: 'MEMORY WITCH', art: '🔮', text: 'For now~', choices: null },
  ],
  after_third_battle: [
    { speaker: 'NARRATOR', art: '🌑', text: 'As the witch dissolves, you catch a flash of stolen memory — not yours. A child, laughing in Vaelthorn\'s sunlit streets.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'Was that... what this city used to be? God. What he took from them.', choices: null },
    { speaker: 'NARRATOR', art: '🌑', text: 'The ember blade is nearly full. It blazes like a coal against your side. The throne room is close.', choices: null },
  ],

  before_fourth_battle: [
    { speaker: 'NARRATOR', art: '🌑', text: 'The throne room doors. Thirty feet of black iron, sealed with the Hollow King\'s will. And guarding them...', choices: null },
    { speaker: 'ECHO KNIGHT', art: '⚔️', text: '...Ashwalker. I fought four of your predecessors. They were strong. You look... tired.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'I am tired. Tired of this world the king made. What about you?', choices: null },
    { speaker: 'ECHO KNIGHT', art: '⚔️', text: '...I am not permitted to be tired. Raise your blade.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'I\'m sorry for what has to happen.', choices: null },
  ],
  after_fourth_battle: [
    { speaker: 'NARRATOR', art: '⚔️', text: 'The Echo Knight\'s armor clatters to the ground. For a moment, the face beneath is just a man. Young. Afraid. Then — peace.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'Rest. You\'ve stood long enough.', choices: null },
    { speaker: 'NARRATOR', art: '🌑', text: 'The great doors groan open. Beyond them: the throne room. And on the throne... the king.', choices: null },
    { speaker: 'NARRATOR', art: '🌑', text: 'He is immense. He is ancient. He is every candle that ever went out at once, given a crown.', choices: null },
    {
      speaker: 'HOLLOW KING', art: '👑',
      text: '...An Ashwalker. At last. I have been waiting... for someone worthy of ending this.',
      choices: [
        { text: '→ "Then let\'s end it."', next: 'before_final_battle' },
        { text: '→ "You wanted this? You could have stopped."', next: 'before_final_battle_alt' },
      ]
    },
  ],

  before_final_battle: [
    { speaker: 'HOLLOW KING', art: '👑', text: 'Three centuries I have sat. Three centuries I have waited for a flame strong enough to unmake me.', choices: null },
    { speaker: 'HOLLOW KING', art: '👑', text: 'The darkness took me unwilling. But it taught me something: I am not the prison. I am the prisoner.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'Then I\'ll set you free.', choices: null },
    { speaker: 'HOLLOW KING', art: '👑', text: 'PROVE IT.', choices: null },
  ],
  before_final_battle_alt: [
    { speaker: 'HOLLOW KING', art: '👑', text: '...I tried. In the beginning. I raged against the dark for a century.', choices: null },
    { speaker: 'HOLLOW KING', art: '👑', text: 'But the dark is patient. It wears you down. It takes your name. It takes your will. It takes everything except the hollow where you used to be.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: 'Mira used to say: a candle doesn\'t surrender to the dark. It just... burns.', choices: null },
    { speaker: 'HOLLOW KING', art: '👑', text: '...Burn then, Ashwalker. And take me with you.', choices: null },
  ],

  ending: [
    { speaker: 'NARRATOR', art: '✨', text: 'The Hollow King falls. The crown — fused to what was once bone — cracks along lines of pure light.', choices: null },
    { speaker: 'NARRATOR', art: '✨', text: 'Something enormous lets out a breath it has been holding for three hundred years.', choices: null },
    { speaker: 'NARRATOR', art: '✨', text: 'Dawn breaks over Vaelthorn for the first time in living memory. The ash begins to cool. The silence begins to soften.', choices: null },
    { speaker: 'KAEL', art: '⚔️', text: '...Mira. You should see this.', choices: null },
    { speaker: 'NARRATOR', art: '✨', text: 'The ember blade grows cold. Its work is done. Somewhere, very far away, something that once was a king finally rests.', choices: null },
    { speaker: 'NARRATOR', art: '✨', text: 'You are the last Ashwalker. And for the first time in a long time, that is enough.', choices: null },
    { speaker: '— FIN —', art: '🌅', text: 'ECHOES OF THE HOLLOW KING\nThank you for playing.\n\n"The dark is patient. But light is stubborn."', choices: null },
  ],
};

// ─── STORY ENGINE ────────────────────────────
let storyQueue = [];
let storyIndex = 0;
let storyCallback = null;

function startStory(key, callback) {
  storyQueue = STORIES[key] || [];
  storyIndex = 0;
  storyCallback = callback;
  Screen.show('story');
  advanceStory();
}

function advanceStory() {
  if (storyIndex >= storyQueue.length) {
    if (storyCallback) storyCallback();
    return;
  }
  const node = storyQueue[storyIndex];
  G.storyNode = node;

  $('story-speaker').textContent = node.speaker || '';
  $('scene-art').textContent = node.art || '🌑';

  // Typewriter effect
  // FIX: pass node reference so the skip handler can use the correct node
  typeText($('story-text'), node.text, 28, () => {
    // FIX: null out typingTimer once typewriter completes so skip-detection works correctly
    G.typingTimer = null;
    if (!node.choices || node.choices.length === 0) {
      $('story-continue').style.display = 'block';
      $('story-choices').innerHTML = '';
    } else {
      $('story-continue').style.display = 'none';
      renderChoices(node.choices);
    }
  });
}

function typeText(el, text, speed, cb) {
  el.textContent = '';
  // FIX: clear any previous timer before starting a new one
  if (G.typingTimer) {
    clearInterval(G.typingTimer);
    G.typingTimer = null;
  }
  let i = 0;
  const chars = text.split('');
  G.typingTimer = setInterval(() => {
    el.textContent += chars[i++];
    if (i >= chars.length) {
      clearInterval(G.typingTimer);
      G.typingTimer = null; // FIX: null out after completion so skip check works
      if (cb) cb();
    }
  }, speed);
}

function renderChoices(choices) {
  const container = $('story-choices');
  container.innerHTML = '';
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.addEventListener('click', () => {
      if (choice.next && STORIES[choice.next]) {
        startStory(choice.next, storyCallback);
      } else {
        storyIndex++;
        advanceStory();
      }
    });
    container.appendChild(btn);
  });
}

// ─── COMBAT ENGINE ───────────────────────────
function startBattle(enemyId, onWin, onLose) {
  const template = ENEMY_ROSTER.find(e => e.id === enemyId);
  G.currentEnemy = JSON.parse(JSON.stringify(template));
  G.currentEnemy.statusTurns = {};
  G.player.statuses = [];
  G.combatLocked = false;
  G.combatTurn = 'player';

  Screen.show('combat');
  flash();

  updateCombatUI();
  clearLog();
  logEntry(G.currentEnemy.intro, 'system');
  logEntry('━━━━━━━━━━━━━━━━━━━━━━━', 'system');

  G._onWin = onWin;
  G._onLose = onLose;
  renderActions();
}

function clearLog() {
  $('combat-log').innerHTML = '';
}

function logEntry(text, type = 'system') {
  const el = document.createElement('div');
  el.className = `log-entry log-${type}`;
  el.textContent = '▸ ' + text;
  $('combat-log').appendChild(el);
  $('combat-log').scrollTop = $('combat-log').scrollHeight;
}

function updateCombatUI() {
  const p = G.player;
  const e = G.currentEnemy;

  // Enemy bars
  const eHpPct = clamp((e.hp / e.maxHp) * 100, 0, 100);
  $('enemy-hp-bar').style.width = eHpPct + '%';
  $('enemy-name').textContent = e.name;
  $('enemy-hp-text').textContent = `${Math.max(0, e.hp)} / ${e.maxHp}`;
  $('enemy-art').textContent = e.art;

  // Player bars
  const pHpPct = clamp((p.hp / p.maxHp) * 100, 0, 100);
  const pMpPct = clamp((p.mp / p.maxMp) * 100, 0, 100);
  $('player-hp-bar').style.width = pHpPct + '%';
  $('player-mp-bar').style.width = pMpPct + '%';
  $('player-hp-text').textContent = `${Math.max(0, p.hp)} / ${p.maxHp}`;
  $('player-mp-text').textContent = `${Math.max(0, p.mp)} / ${p.maxMp}`;

  // FIX: reset HP bar style before conditionally overriding, so it reverts properly when HP recovers
  $('player-hp-bar').style.background = '';
  $('player-hp-bar').style.boxShadow = '';
  if (pHpPct < 25) {
    $('player-hp-bar').style.background = 'linear-gradient(90deg, #ff1744, #b71c1c)';
    $('player-hp-bar').style.boxShadow = '0 0 12px rgba(255,23,68,0.8)';
  }

  // Stats
  $('player-stats').innerHTML = `<span>ATK <span class="stat-val">${p.atk}</span></span><span>DEF <span class="stat-val">${p.def}</span></span><span>LV <span class="stat-val">${p.level}</span></span>`;

  renderStatuses();
}

function renderStatuses() {
  // Render enemy statuses
  const enemyEl = $('enemy-status');
  if (enemyEl) {
    enemyEl.innerHTML = '';
    (G.currentEnemy.statuses || []).forEach(s => {
      const tag = document.createElement('span');
      tag.className = `status-tag status-${s.id}`;
      tag.textContent = s.label;
      enemyEl.appendChild(tag);
    });
  }

  // FIX: also render player statuses (was missing entirely in original)
  const playerStatusEl = $('player-status');
  if (playerStatusEl) {
    playerStatusEl.innerHTML = '';
    (G.player.statuses || []).forEach(s => {
      const tag = document.createElement('span');
      tag.className = `status-tag status-${s.id}`;
      tag.textContent = s.label;
      playerStatusEl.appendChild(tag);
    });
  }
}

function renderActions() {
  $('action-menu').classList.remove('hidden');
  $('sub-menu').classList.add('hidden');

  const grid = $('action-grid');
  grid.innerHTML = '';

  const actions = [
    { label: 'STRIKE', icon: '⚔️', key: 'attack' },
    { label: 'SKILLS', icon: '✨', key: 'skills' },
    { label: 'ITEMS', icon: '🧪', key: 'items' },
    { label: 'ENDURE', icon: '🛡️', key: 'defend' },
  ];

  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.innerHTML = `<span class="action-icon">${a.icon}</span>${a.label}`;
    btn.addEventListener('click', () => handleAction(a.key));
    grid.appendChild(btn);
  });
}

function handleAction(key) {
  if (G.combatLocked) return;

  if (key === 'attack') {
    performPlayerAttack(null);
  } else if (key === 'defend') {
    performPlayerDefend();
  } else if (key === 'skills') {
    showSubMenu('SKILLS', G.player.skills, (skill) => useSkill(skill));
  } else if (key === 'items') {
    const items = G.player.items.filter(i => i.count > 0);
    // FIX: map items to sub-menu entries, preserving count for display
    showSubMenu('ITEMS', items.map(i => ({
      name: i.name, icon: '🧪', desc: i.desc, cost: null,
      count: i.count,
      _item: i
    })), (entry) => useItem(entry._item));
  }
}

function showSubMenu(title, entries, onSelect) {
  $('action-menu').classList.add('hidden');
  const sub = $('sub-menu');
  sub.classList.remove('hidden');
  $('sub-menu-title').textContent = title;

  const list = $('sub-menu-list');
  list.innerHTML = '';

  if (entries.length === 0) {
    const empty = document.createElement('span');
    empty.style.color = 'var(--text-dim)';
    empty.style.fontSize = '0.8rem';
    empty.textContent = 'NOTHING AVAILABLE';
    list.appendChild(empty);
    return;
  }

  entries.forEach(entry => {
    const btn = document.createElement('button');
    btn.className = 'sub-btn';
    // FIX: only disable if cost is a positive number AND player lacks MP
    const hasCost = typeof entry.cost === 'number' && entry.cost > 0;
    const disabled = hasCost && G.player.mp < entry.cost;
    if (disabled) btn.disabled = true;
    btn.innerHTML = `
      <span>${entry.icon || entry.name}</span>
      <span>${entry.name}</span>
      ${hasCost ? `<span class="sub-cost">${entry.cost} MP</span>` : ''}
      ${entry.desc ? `<span class="sub-desc">${entry.desc}</span>` : ''}
      ${entry.count !== undefined ? `<span class="sub-cost">×${entry.count}</span>` : ''}
    `;
    btn.addEventListener('click', () => {
      if (!disabled) onSelect(entry);
    });
    list.appendChild(btn);
  });
}

// ─── PLAYER ACTIONS ──────────────────────────
async function performPlayerAttack(skillOverride) {
  lockCombat();
  hideSubMenu();

  const p = G.player;
  const e = G.currentEnemy;

  // Hit chance
  const hitRoll = Math.random();
  if (hitRoll < 0.05) {
    logEntry(`Kael attacks but misses!`, 'miss');
    floatOverEnemy(0, 'miss');
    await sleep(600);
    await enemyTurn();
    return;
  }

  // Calculate damage
  let dmg = rand(p.atk - 4, p.atk + 6);
  const defReduction = e.def * 0.5;
  dmg = Math.max(1, Math.floor(dmg - defReduction));

  // Critical hit
  const critChance = (skillOverride && skillOverride.critBonus) ? 0.15 + skillOverride.critBonus : 0.12;
  const isCrit = Math.random() < critChance;
  if (isCrit) {
    dmg = Math.floor(dmg * 1.8);
    logEntry(`CRITICAL HIT! Kael's blade finds a weak point!`, 'crit');
    floatOverEnemy(dmg, 'crit');
  } else {
    logEntry(`Kael strikes for ${dmg} damage.`, 'player');
    floatOverEnemy(dmg, 'hit');
  }

  // Apply damage
  e.hp = Math.max(0, e.hp - dmg);
  shakeElement('enemy-art');
  updateCombatUI();
  await sleep(300);

  // Apply burn effect
  if (skillOverride && skillOverride.effect === 'burn' && Math.random() < (skillOverride.effectChance || 0.4)) {
    applyStatus(e, { id: 'burn', label: '🔥BURN', duration: 3 });
    logEntry('The enemy is burning!', 'special');
  }

  if (e.hp <= 0) {
    await handleEnemyDeath();
    return;
  }

  await sleep(400);
  await enemyTurn();
}

async function performPlayerSkill(skill) {
  const p = G.player;
  if (p.mp < skill.cost) {
    logEntry('Not enough Ember!', 'system');
    unlockCombat();
    renderActions();
    return;
  }

  lockCombat();
  hideSubMenu();
  p.mp -= skill.cost;
  updateCombatUI();

  const e = G.currentEnemy;

  if (skill.type === 'attack' || skill.type === 'pierce') {
    logEntry(`Kael unleashes ${skill.name}!`, 'special');
    let dmg = rand(p.atk - 2, p.atk + 8);
    dmg = Math.floor(dmg * skill.multiplier);
    if (skill.type !== 'pierce') {
      const defReduction = e.def * 0.4;
      dmg = Math.max(1, Math.floor(dmg - defReduction));
    }
    const isCrit = Math.random() < (0.1 + (skill.critBonus || 0));
    if (isCrit) {
      dmg = Math.floor(dmg * 1.7);
      logEntry(`CRITICAL! ${skill.name} strikes true!`, 'crit');
      floatOverEnemy(dmg, 'crit');
    } else {
      logEntry(`${skill.name} deals ${dmg} damage!`, 'player');
      floatOverEnemy(dmg, 'hit');
    }
    e.hp = Math.max(0, e.hp - dmg);
    shakeElement('enemy-art');
    updateCombatUI();

    if (skill.effect && Math.random() < (skill.effectChance || 0.4)) {
      applyStatus(e, { id: skill.effect, label: statusLabel(skill.effect), duration: 3 });
      logEntry(`${skill.name} inflicts ${skill.effect}!`, 'special');
    }

    await sleep(400);
    if (e.hp <= 0) { await handleEnemyDeath(); return; }

  } else if (skill.type === 'buff') {
    // FIX: buff targets the player (p), not the enemy
    applyStatus(p, { id: skill.stat, label: statusLabel(skill.stat), duration: 2 });
    logEntry(`Kael activates ${skill.name}! Defense raised.`, 'special');
    floatOverPlayer(skill.stat === 'guard' ? 'GUARD' : 'BUFF', 'heal');
    await sleep(400);

  } else if (skill.type === 'heal') {
    const healAmt = skill.value + rand(0, 10);
    const actual = Math.min(healAmt, p.maxHp - p.hp);
    p.hp = Math.min(p.maxHp, p.hp + actual);
    logEntry(`${skill.name} restores ${actual} HP!`, 'heal');
    floatOverPlayer(actual, 'heal');
    if (skill.effect === 'regen') {
      applyStatus(p, { id: 'regen', label: '💚REGEN', duration: 3 });
      logEntry('Kael is regenerating!', 'special');
    }
    updateCombatUI();
    await sleep(400);

  } else if (skill.type === 'drain') {
    let dmg = rand(p.atk, p.atk + 6);
    dmg = Math.floor(dmg * skill.multiplier);
    dmg = Math.max(1, Math.floor(dmg - e.def * 0.3));
    const drain = Math.floor(dmg * 0.4);
    e.hp = Math.max(0, e.hp - dmg);
    p.hp = Math.min(p.maxHp, p.hp + drain);
    p.mp = Math.min(p.maxMp, p.mp + Math.floor(drain / 2));
    logEntry(`${skill.name} drains ${dmg} and restores ${drain} HP!`, 'special');
    floatOverEnemy(dmg, 'hit');
    shakeElement('enemy-art');
    updateCombatUI();
    await sleep(400);
    if (e.hp <= 0) { await handleEnemyDeath(); return; }
  }

  await enemyTurn();
}

async function performPlayerDefend() {
  lockCombat();
  applyStatus(G.player, { id: 'guard', label: '🛡️GUARD', duration: 1 });
  logEntry('Kael braces for the next strike. Defense greatly increased.', 'player');
  updateCombatUI();
  await sleep(400);
  await enemyTurn();
}

function useSkill(skill) {
  performPlayerSkill(skill);
}

function useItem(item) {
  lockCombat();
  hideSubMenu();
  const p = G.player;
  item.count--;

  if (item.type === 'heal') {
    const heal = Math.min(item.value, p.maxHp - p.hp);
    p.hp += heal;
    logEntry(`Kael uses ${item.name} and restores ${heal} HP!`, 'heal');
    floatOverPlayer(heal, 'heal');
  } else if (item.type === 'mp') {
    const restore = Math.min(item.value, p.maxMp - p.mp);
    p.mp += restore;
    logEntry(`Kael uses ${item.name} and restores ${restore} Ember!`, 'special');
    floatOverPlayer(restore, 'heal');
  }
  updateCombatUI();
  setTimeout(() => enemyTurn(), 600);
}

// ─── ENEMY TURN ──────────────────────────────
async function enemyTurn() {
  const e = G.currentEnemy;
  const p = G.player;
  if (e.hp <= 0) return;

  await sleep(600);
  logEntry(`━ ${e.name}'s turn ━`, 'system');
  await sleep(300);

  // Process enemy statuses
  for (const status of (e.statuses || [])) {
    if (status.id === 'burn') {
      const burnDmg = rand(6, 12);
      e.hp = Math.max(0, e.hp - burnDmg);
      logEntry(`${e.name} takes ${burnDmg} burn damage!`, 'damage');
      updateCombatUI();
      if (e.hp <= 0) { await handleEnemyDeath(); return; }
    }
  }
  tickStatuses(e);

  // Pick action
  const actionKey = e.actions[rand(0, e.actions.length - 1)];
  const action = ENEMY_ACTIONS[actionKey];
  if (!action) {
    // FIX: always tick player statuses and unlock even on unknown action
    tickStatuses(p);
    unlockCombat();
    renderActions();
    return;
  }

  if (action.type === 'buff') {
    if (action.buff === 'guard') {
      applyStatus(e, { id: 'guard', label: '🛡️GUARD', duration: 1 });
      logEntry(`${e.name} ${action.name}!`, 'system');
    } else if (action.buff === 'atk_up') {
      e.atk = Math.floor(e.atk * 1.2);
      logEntry(`${e.name} ${action.name}! Its attack rises!`, 'system');
    }
    updateCombatUI();
    await sleep(500);
    // FIX: tick player statuses even when enemy uses a buff/special action,
    // so guard/regen/etc. don't persist indefinitely on non-attacking turns
    tickStatuses(p);
    unlockCombat();
    renderActions();
    return;
  }

  if (action.type === 'special') {
    logEntry(`${e.name} ${action.name}.`, 'system');
    await sleep(400);
    // FIX: tick player statuses on special actions too
    tickStatuses(p);
    unlockCombat();
    renderActions();
    return;
  }

  // Calculate enemy damage
  if (action.multi > 0) {
    const hitRoll = Math.random();
    if (hitRoll < 0.08) {
      logEntry(`${e.name} ${action.name} but misses!`, 'miss');
      floatOverPlayer(0, 'miss');
      await sleep(500);
      tickStatuses(p);
      unlockCombat();
      renderActions();
      return;
    }

    let dmg = rand(e.atk - 4, e.atk + 4);
    dmg = Math.floor(dmg * action.multi);

    // Player guard reduces damage
    const isGuarding = p.statuses.some(s => s.id === 'guard');
    if (isGuarding) {
      dmg = Math.floor(dmg * 0.45);
      logEntry(`${e.name} ${action.name}! Kael's guard absorbs most of it!`, 'enemy');
    } else {
      const defReduction = p.def * 0.4;
      dmg = Math.max(1, Math.floor(dmg - defReduction));
      logEntry(`${e.name} ${action.name} for ${dmg} damage!`, 'enemy');
    }

    shakeElement('player-art');
    floatOverPlayer(dmg, 'player');
    p.hp = Math.max(0, p.hp - dmg);
    updateCombatUI();

    // Enemy effects on player
    if (action.effect && Math.random() < (action.effectChance || 0.3)) {
      applyStatus(p, { id: action.effect, label: statusLabel(action.effect), duration: 3 });
      logEntry(`${e.name}'s attack inflicts ${action.effect}!`, 'damage');
    }

    // Drain type: enemy heals
    if (action.type === 'drain') {
      const drain = Math.floor(dmg * 0.3);
      e.hp = Math.min(e.maxHp, e.hp + drain);
      logEntry(`${e.name} drains ${drain} essence!`, 'enemy');
      updateCombatUI();
    }

    await sleep(300);

    // Check player death before regen tick
    if (p.hp <= 0) {
      await handlePlayerDeath();
      return;
    }

    // Regen tick for player
    if (p.statuses.some(s => s.id === 'regen')) {
      const regenAmt = rand(8, 15);
      p.hp = Math.min(p.maxHp, p.hp + regenAmt);
      logEntry(`Kael regenerates ${regenAmt} HP.`, 'heal');
      updateCombatUI();
    }
  }

  tickStatuses(p);
  await sleep(400);
  unlockCombat();
  renderActions();
}

// ─── STATUS SYSTEM ───────────────────────────
function applyStatus(target, status) {
  if (!target.statuses) target.statuses = [];
  const existing = target.statuses.find(s => s.id === status.id);
  if (existing) {
    existing.duration = status.duration;
  } else {
    target.statuses.push({ ...status });
  }
  renderStatuses();
}

function tickStatuses(target) {
  if (!target.statuses) return;
  target.statuses = target.statuses
    .map(s => ({ ...s, duration: s.duration - 1 }))
    .filter(s => s.duration > 0);
  renderStatuses();
}

function statusLabel(id) {
  const labels = {
    burn: '🔥BURN', chill: '❄️CHILL', weaken: '💜WEAK',
    regen: '💚REGEN', guard: '🛡️GUARD', stun: '⚡STUN',
    atk_up: '⬆️ATK',
  };
  return labels[id] || id.toUpperCase();
}

// ─── DEATH HANDLERS ──────────────────────────
async function handleEnemyDeath() {
  const e = G.currentEnemy;
  e.hp = 0;
  updateCombatUI();
  logEntry('━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  logEntry(e.deathLine, 'system');
  await sleep(1200);

  // XP and gold
  const p = G.player;
  p.xp += e.xp;
  p.gold += e.gold;
  let levelUp = false;
  while (p.xp >= p.xpNext) {
    p.xp -= p.xpNext;
    p.level++;
    p.xpNext = Math.floor(p.xpNext * 1.6);
    p.maxHp += 15; p.hp = Math.min(p.hp + 15, p.maxHp);
    p.maxMp += 8;  p.mp = Math.min(p.mp + 8, p.maxMp);
    p.atk += 3; p.def += 2;
    levelUp = true;
  }

  // Drop items
  if (e.drops && e.drops.length > 0) {
    e.drops.forEach(dropName => {
      const item = p.items.find(i => i.name === dropName);
      if (item) item.count++;
    });
  }

  // Show victory screen
  Screen.show('victory');
  flash();
  $('victory-title').textContent = e.isBoss ? '⚔ BOSS DEFEATED ⚔' : 'ECHO DESTROYED';
  $('victory-rewards').innerHTML = `
    <div class="reward-line">▸ ${e.xp} XP GAINED</div>
    <div class="reward-line">▸ ${e.gold} GOLD ACQUIRED</div>
    ${e.drops && e.drops.length > 0 ? `<div class="reward-line">▸ ${e.drops.join(', ')} OBTAINED</div>` : ''}
    ${levelUp ? `<div class="reward-line" style="color:var(--amber-glow);text-shadow:var(--glow-amber)">★ LEVEL UP! Now level ${p.level} ★</div>` : ''}
    <div style="margin-top:10px;font-size:0.72rem;color:var(--text-dim)">HP: ${p.hp}/${p.maxHp} · MP: ${p.mp}/${p.maxMp} · ATK: ${p.atk} · DEF: ${p.def}</div>
  `;

  $('btn-continue-victory').onclick = () => {
    if (G._onWin) G._onWin();
  };
}

async function handlePlayerDeath() {
  G.player.hp = 0;
  updateCombatUI();
  logEntry('━━━━━━━━━━━━━━━━━━━━━━━', 'system');
  logEntry('Kael falls. The ember blade grows cold. The darkness wins... for now.', 'system');
  await sleep(1500);
  Screen.show('gameover');
  flash();
  $('gameover-text').textContent =
    'The Hollow King\'s shadow stretches across the land once more.\nBut Ashwalkers do not stay dead easily. The ember still flickers.\n\n"Try again, Ashwalker. The flame remembers."';

  $('btn-retry').onclick = () => {
    G.player = createPlayer();
    runBattleSequence(G.battleNumber);
  };
  $('btn-title').onclick = () => {
    G.player = createPlayer();
    G.battleNumber = 0;
    Screen.show('title');
  };
}

// ─── MAIN GAME FLOW ──────────────────────────
function runBattleSequence(index) {
  G.battleNumber = index;
  if (index >= BATTLE_SEQUENCE.length) {
    Screen.show('title');
    return;
  }

  const battle = BATTLE_SEQUENCE[index];

  startStory(battle.storyBefore, () => {
    startBattle(battle.enemy,
      () => {
        // Win: show after-battle story, then next battle
        startStory(battle.storyAfter, () => {
          runBattleSequence(index + 1);
        });
      },
      () => {
        // Lose: handled inside battle
      }
    );
  });
}

// ─── FLOATING DAMAGE ─────────────────────────
function floatOverEnemy(value, type) {
  const el = $('enemy-art');
  const rect = el.getBoundingClientRect();
  showDamage(value, type, rect.left + rect.width / 2, rect.top + rect.height / 2);
}
function floatOverPlayer(value, type) {
  const el = $('player-art');
  const rect = el.getBoundingClientRect();
  showDamage(value, type, rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function shakeElement(id) {
  const el = $(id);
  el.classList.remove('shake');
  void el.offsetWidth; // force reflow
  el.classList.add('shake');
}

function lockCombat() {
  G.combatLocked = true;
  document.querySelectorAll('.action-btn, .sub-btn').forEach(b => b.disabled = true);
}

function unlockCombat() {
  G.combatLocked = false;
}

function hideSubMenu() {
  $('sub-menu').classList.add('hidden');
  $('action-menu').classList.remove('hidden');
}

// ─── INIT ─────────────────────────────────────
function init() {
  Screen.show('title');

  // Title buttons
  $('btn-new-game').addEventListener('click', () => {
    G.player = createPlayer();
    G.battleNumber = 0;
    flash();
    startStory('intro', () => {
      runBattleSequence(0);
    });
  });

  $('btn-lore').addEventListener('click', () => {
    flash();
    Screen.show('lore');
  });

  $('btn-lore-back').addEventListener('click', () => {
    flash();
    Screen.show('title');
  });

  // Story screen: click to skip typewriter or advance
  $('story-continue').addEventListener('click', () => {
    // FIX: G.typingTimer is now properly nulled on completion,
    // so this check correctly distinguishes "still typing" vs "done"
    if (G.typingTimer) {
      clearInterval(G.typingTimer);
      G.typingTimer = null;
      if (G.storyNode) {
        $('story-text').textContent = G.storyNode.text;
        if (!G.storyNode.choices || G.storyNode.choices.length === 0) {
          $('story-continue').style.display = 'block';
        } else {
          $('story-continue').style.display = 'none';
          renderChoices(G.storyNode.choices);
        }
        return;
      }
    }
    storyIndex++;
    advanceStory();
  });

  $('story-text-box').addEventListener('click', () => {
    $('story-continue').click();
  });

  // Sub menu back button
  $('sub-menu-back').addEventListener('click', () => {
    hideSubMenu();
    renderActions();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (Screen.current === 'story' && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      $('story-continue').click();
    }
    if (Screen.current === 'title' && e.code === 'Enter') {
      $('btn-new-game').click();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);