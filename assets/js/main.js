/* ===== PARTICLE BACKGROUND ===== */
(function () {
  const container = document.getElementById('bgParticles');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5
      ? `hsla(245, 85%, 65%, ${this.alpha})`
      : `hsla(190, 90%, 55%, ${this.alpha})`;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(245, 85%, 65%, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    drawLines();
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
  window.addEventListener('resize', () => { resize(); init(); });
})();

/* ===== PASSWORD TOGGLE ===== */
function passwordAccess(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  icon.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    icon.classList.toggle('ri-eye-line');
    icon.classList.toggle('ri-eye-off-line');
  });
}

passwordAccess('password', 'loginPassword');
passwordAccess('passwordCreate', 'loginPasswordCreate');

/* ===== SWITCH FORMS ===== */
const loginWrap = document.getElementById('loginAccessRegister');
const btnRegister = document.getElementById('loginButtonRegister');
const btnAccess = document.getElementById('loginButtonAccess');

btnRegister.addEventListener('click', () => loginWrap.classList.add('active'));
btnAccess.addEventListener('click', () => loginWrap.classList.remove('active'));

/* ===== BUTTON RIPPLE ===== */
document.querySelectorAll('.login__button').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,0.25);
      transform:scale(0); animation:ripple 0.6s ease-out forwards;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* Ripple keyframe injected dynamically */
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(style);

/* ===== INPUT FOCUS ICON COLOR ===== */
document.querySelectorAll('.login__input').forEach(input => {
  const box = input.closest('.login__box');
  const icon = box.querySelector('.login__icon:not(.login__icon--right)');
  input.addEventListener('focus', () => { if (icon) icon.style.color = 'var(--accent)'; });
  input.addEventListener('blur', () => { if (icon) icon.style.color = ''; });
});
