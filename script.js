const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Track mouse position for the trail
let mouse = { x: undefined, y: undefined };

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  // Spawn particles on move for a "smoke" trail
  for (let i = 0; i < 2; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

const gravity = 0.2;
const friction = 0.98;
const particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Faster initial burst
    this.vx = (Math.random() - 0.5) * 12;
    this.vy = (Math.random() - 0.5) * 12;
    this.radius = Math.random() * 4 + 1;
    this.life = 1;
    this.hue = Math.random() * 360;
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls with energy loss
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vx = -this.vx * 0.8;
    }
    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.vy *= -0.6;
    }

    this.life -= 0.015;
    this.hue += 2; // Shifting colors
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    
    // Add Glow Effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
    ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
    
    ctx.globalAlpha = this.life;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  // Semi-transparent clear creates the "motion blur"
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
