// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  // Minimal launcher scaffold — no built-in games.
  // Use GameLauncher.registerGame({ id, name, desc, init(container) { ... } }) to add games.

  const games = [
  {
    id: "game1",
    title: "The Button",
    thumbnail: "https://example.com/game1_thumbnail.jpg",
    description: "Click the button to win!",
    instructions: "Click the button as fast as you can.",
    playLink: "https://example.com/game1",
  },
  {
    id: "game2",
    title: "Soulweaver",
    thumbnail: "https://example.com/game2_thumbnail.jpg",
    description: "Weave the souls together to create a masterpiece.",
    instructions: "Use the arrow keys to weave the souls.",
    playLink: "https://example.com/game2",
  },
  // ... other games
];
  let activeInstance = null;

  function registerGame(game) {
    if (!game || !game.id || !game.name || typeof game.init !== 'function') {
      console.error('Invalid game registration', game);
      return;
    }
    if (games.some(g => g.id === game.id)) {
      console.warn('Game id already registered:', game.id);
      return;
    }
    games.push(game);
    renderList(document.getElementById('search')?.value || '');
  }

  // expose API for adding games from other scripts
  window.GameLauncher = {
    registerGame,
    list: games,
  };

  const listEl = document.getElementById('game-list');
  const playArea = document.getElementById('play-area');
  const search = document.getElementById('search');

  if (!listEl || !playArea || !search) {
    console.error('Missing DOM elements: ensure index.html contains #game-list, #play-area and #search');
    return;
  }

  function stopActive() {
    if (!activeInstance) return;
    try {
      if (typeof activeInstance.stop === 'function') activeInstance.stop();
    } catch (e) {
      console.error('Error stopping active game:', e);
    }
    activeInstance = null;
  }

  function renderList(filter = '') {
    listEl.innerHTML = '';
    const filtered = games.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));
    if (filtered.length === 0) {
      listEl.innerHTML = "<p style='opacity:.7'>No games found.</p>";
      return;
    }
    filtered.forEach(g => {
      const el = document.createElement('div');
      el.className = 'game-item';
      el.innerHTML = `
        <div class="game-meta">
          <h3>${g.name}</h3>
          <p>${g.desc || ''}</p>
        </div>
        <div>
          <button class="play-btn">Play</button>
        </div>
      `;
      el.querySelector('.play-btn').addEventListener('click', async () => {
        stopActive();
        try {
          // allow init to be async and to return an object with optional stop()
          const result = await g.init(playArea);
          activeInstance = (result && typeof result.stop === 'function') ? result : null;
        } catch (e) {
          console.error('Failed to start game', g.id, e);
        }
        document.querySelector('#placeholder')?.remove();
      });
      listEl.appendChild(el);
    });
  }

  search.addEventListener('input', (e) => renderList(e.target.value));
  renderList();
  if (!playArea.querySelector('.footer-note')) {
    playArea.insertAdjacentHTML('beforeend', `<div class="footer-note">No built-in games — register via GameLauncher.registerGame()</div>`);
  }
});
// ...existing code...