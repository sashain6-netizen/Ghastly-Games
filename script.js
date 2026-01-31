// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  // Simple searchable game launcher with two small built-in games.
  // Replace or extend the games[] array to add more.

  const games = [
    {
      id: "click-dot",
      name: "Click the Dot",
      desc: "Click the moving dot to score points.",
      init(container) {
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.gap = "8px";

        const hud = document.createElement("div");
        hud.style.display = "flex";
        hud.style.justifyContent = "space-between";
        hud.style.alignItems = "center";
        hud.innerHTML = `<div>Score: <span id="score">0</span></div><button id="reset">Reset</button>`;

        const canvas = document.createElement("canvas");
        canvas.tabIndex = 0;
        wrapper.appendChild(hud);
        wrapper.appendChild(canvas);
        container.innerHTML = "";
        container.appendChild(wrapper);

        const ctx = canvas.getContext("2d");
        function resize() {
          canvas.width = container.clientWidth;
          canvas.height = Math.max(100, container.clientHeight - hud.clientHeight - 8);
        }
        resize();
        window.addEventListener("resize", resize);

        let score = 0;
        let dot = { x: 50, y: 50, r: 20 };
        const scoreEl = hud.querySelector("#score");
        hud.querySelector("#reset").addEventListener("click", () => { score = 0; scoreEl.textContent = 0; });

        function spawn() {
          dot.r = 12 + Math.random() * 28;
          dot.x = dot.r + Math.random() * Math.max(1, (canvas.width - dot.r * 2));
          dot.y = dot.r + Math.random() * Math.max(1, (canvas.height - dot.r * 2));
        }
        spawn();

        let running = true;
        let rafId = null;

        function loop() {
          if (!running) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // background subtle gradient
          const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          g.addColorStop(0, "rgba(255,255,255,0.02)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // draw dot
          ctx.beginPath();
          ctx.fillStyle = "#6ee7b7";
          ctx.shadowColor = "#6ee7b7";
          ctx.shadowBlur = 20;
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          rafId = requestAnimationFrame(loop);
        }

        const clickHandler = (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const d2 = (x - dot.x) ** 2 + (y - dot.y) ** 2;
          if (d2 <= dot.r * dot.r) {
            score++;
            scoreEl.textContent = score;
            spawn();
          }
        };
        canvas.addEventListener("click", clickHandler);

        loop();
        return {
          stop() {
            running = false;
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("click", clickHandler);
            if (rafId) cancelAnimationFrame(rafId);
          },
        };
      },
    },
    {
      id: "mini-snake",
      name: "Mini Snake",
      desc: "Arrow keys to move. Eat food to grow.",
      init(container) {
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        container.innerHTML = "";
        container.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const scale = 20;
        let cols, rows;
        function resize() {
          canvas.width = Math.max(100, Math.floor(container.clientWidth / scale) * scale);
          canvas.height = Math.max(100, Math.floor(container.clientHeight / scale) * scale);
          cols = Math.max(1, canvas.width / scale);
          rows = Math.max(1, canvas.height / scale);
        }
        resize();
        window.addEventListener("resize", resize);

        let snake = [{ x: 5, y: 5 }];
        let dir = { x: 1, y: 0 };
        let food = { x: 10, y: 8 };
        let running = true;
        let tick = 0;
        let speed = 8;
        let rafId = null;

        function placeFood() {
          food.x = Math.floor(Math.random() * cols);
          food.y = Math.floor(Math.random() * rows);
        }

        function step() {
          if (!running) return;
          tick++;
          if (tick % speed !== 0) return;
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
          // wrap around
          head.x = (head.x + cols) % cols;
          head.y = (head.y + rows) % rows;
          // collision with self
          if (snake.some(s => s.x === head.x && s.y === head.y)) {
            running = false;
            return;
          }
          snake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            placeFood();
          } else {
            snake.pop();
          }
        }

        function draw() {
          ctx.fillStyle = "#071022";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // food
          ctx.fillStyle = "#ff7a7a";
          ctx.fillRect(food.x * scale + 2, food.y * scale + 2, scale - 4, scale - 4);
          // snake
          ctx.fillStyle = "#6ee7b7";
          snake.forEach((s) => {
            ctx.fillRect(s.x * scale + 1, s.y * scale + 1, scale - 2, scale - 2);
          });
        }

        function loop() {
          if (!running) {
            // show game over text
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "20px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Game Over — Press R to restart", canvas.width / 2, canvas.height / 2);
            return;
          }
          step();
          draw();
          rafId = requestAnimationFrame(loop);
        }

        function key(e) {
          const k = e.key;
          if (k === "ArrowUp" && dir.y === 0) dir = { x: 0, y: -1 };
          if (k === "ArrowDown" && dir.y === 0) dir = { x: 0, y: 1 };
          if (k === "ArrowLeft" && dir.x === 0) dir = { x: -1, y: 0 };
          if (k === "ArrowRight" && dir.x === 0) dir = { x: 1, y: 0 };
          if (k === "r" || k === "R") {
            // restart
            snake = [{ x: 5, y: 5 }];
            dir = { x: 1, y: 0 };
            running = true;
            placeFood();
            loop();
          }
        }
        window.addEventListener("keydown", key);
        placeFood();
        loop();

        return {
          stop() {
            running = false;
            window.removeEventListener("resize", resize);
            window.removeEventListener("keydown", key);
            if (rafId) cancelAnimationFrame(rafId);
          },
        };
      },
    },
  ];

  const listEl = document.getElementById("game-list");
  const playArea = document.getElementById("play-area");
  const search = document.getElementById("search");

  if (!listEl || !playArea || !search) {
    console.error("Missing DOM elements: ensure index.html contains #game-list, #play-area and #search");
    return;
  }

  let activeInstance = null;

  function stopActive() {
    if (activeInstance && activeInstance.stop) {
      try { activeInstance.stop(); } catch (e) { console.error(e); }
      activeInstance = null;
    }
  }

  function renderList(filter = "") {
    listEl.innerHTML = "";
    const filtered = games.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));
    if (filtered.length === 0) {
      listEl.innerHTML = "<p style='opacity:.7'>No games found.</p>";
      return;
    }
    filtered.forEach(g => {
      const el = document.createElement("div");
      el.className = "game-item";
      el.innerHTML = `
        <div class="game-meta">
          <h3>${g.name}</h3>
          <p>${g.desc}</p>
        </div>
        <div>
          <button class="play-btn">Play</button>
        </div>
      `;
      el.querySelector(".play-btn").addEventListener("click", () => {
        stopActive();
        activeInstance = g.init(playArea);
        document.querySelector("#placeholder")?.remove();
      });
      listEl.appendChild(el);
    });
  }

  search.addEventListener("input", (e) => renderList(e.target.value));
  renderList();
  if (!playArea.querySelector(".footer-note")) {
    playArea.insertAdjacentHTML("beforeend", `<div class="footer-note">Built-in games • Minimal demo</div>`);
  }
});
// ...existing code...