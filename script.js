// Game template for Snake
const snakeGame = {
  id: "snake",
  name: "Snake",
  desc: "Control the snake and eat food to grow.",
  instructions: "Use the arrow keys to move the snake.",
  playLink: "https://example.com/snake",
  init: (container) => {
    // Snake game initialization logic
  }
};

const games = [snakeGame];

function renderList(filter = '') {
  const gameListEl = document.getElementById('game-list');
  gameListEl.innerHTML = '';
  const filtered = games.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length === 0) {
    gameListEl.innerHTML = "<p style='opacity:.7'>No games found.</p>";
    return;
  }
  
  const numColumns = 3; // Number of columns in the grid
  const maxRows = Math.ceil(filtered.length / numColumns); // Maximum number of rows
  
  filtered.forEach((game, index) => {
    const row = Math.floor(index / numColumns); // Calculate the row index
    const col = index % numColumns; // Calculate the column index
    
    const gameItemEl = document.createElement('div');
    gameItemEl.className = 'game-item';
    gameItemEl.innerHTML = `
      <div class="game-meta">
        <h3>${game.name}</h3>
        <p>${game.desc || ''}</p>
      </div>
      <div>
        <button class="play-btn">Play</button>
      </div>
    `;
    
    // Add game item to the grid
    const rowEl = document.getElementById(`row-${row}`);
    if (!rowEl) {
      rowEl = document.createElement('div');
      rowEl.id = `row-${row}`;
      gameListEl.appendChild(rowEl);
    }
    rowEl.appendChild(gameItemEl);
    
    // Set the width of the game item based on the number of columns
    gameItemEl.style.width = `${100 / numColumns}%`;
    gameItemEl.style.marginRight = rowEl.children.length % numColumns === col ? '0' : '1%';
    
    // Add event listener to the play button
    gameItemEl.querySelector('.play-btn').addEventListener('click', () => {
      game.init(gameItemEl);
    });
  });
}

// Call the renderList function on page load
document.addEventListener('DOMContentLoaded', () => {
  renderList();
});