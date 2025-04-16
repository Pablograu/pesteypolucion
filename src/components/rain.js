const canvas = document.querySelector('.rain-canvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Raindrop properties
const raindrops = [];
const raindropCount = 500;

// Raindrop class
class Raindrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width; // Random horizontal position
    this.y = Math.random() * -canvas.height; // Start above the screen
    this.length = Math.random() * 1 + 1; // Raindrop length
    this.speed = Math.random() * 1.5; // Falling speed
    this.opacity = Math.random() * 0.5 + 0.5; // Random transparency
  }

  fall() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.reset(); // Reset raindrop to the top if it falls out of view
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.strokeStyle = `rgba(000, 000, 000, ${this.opacity})`; // Light blue color
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// Initialize raindrops
for (let i = 0; i < raindropCount; i++) {
  raindrops.push(new Raindrop());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  raindrops.forEach((raindrop) => {
    raindrop.fall();
    raindrop.draw();
  });

  requestAnimationFrame(animate); // Continue the animation
}

// Start animation
animate();

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
