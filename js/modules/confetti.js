// Scope: confetti — a lightweight canvas "serpentinas" burst,
// no external library. Used when the wheel lands and when the
// quiz reveals a result.

const COLORS = ["#ffe3b3", "#ffb178", "#ff8c7a", "#f3617a", "#8a5aa8", "#f4a259"];

export function burstConfetti({ count = 140, duration = 2600 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const pieces = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: -30 - Math.random() * h * 0.5,
    len: 10 + Math.random() * 18,
    width: 4 + Math.random() * 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.25,
    vx: (Math.random() - 0.5) * 2,
    vy: 2.2 + Math.random() * 3.2,
    sway: Math.random() * Math.PI * 2,
  }));

  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const fade = Math.max(0, 1 - elapsed / duration);
    ctx.clearRect(0, 0, w, h);
    pieces.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.sway + elapsed / 300) * 0.6;
      p.rotation += p.rotationSpeed;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.width / 2, -p.len / 2, p.width, p.len);
      ctx.restore();
    });
    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}
