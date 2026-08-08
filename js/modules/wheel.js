// Scope: wheel — canvas "ruleta de la suerte" that spins to a story.

import { burstConfetti } from "./confetti.js";

export function initWheel(data) {
  const canvas = document.getElementById("wheel-canvas");
  const spinBtn = document.getElementById("spinBtn");
  const resultEl = document.getElementById("wheel-result");
  if (!canvas || !spinBtn) return;

  const stories = data.stories;
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 6;
  const colors = ["#ffe3b3", "#ffb178", "#ff8c7a", "#f3617a", "#8a5aa8", "#4a3170", "#f4a259", "#d97ba0"];
  const slice = (Math.PI * 2) / stories.length;
  let rotation = 0;
  let spinning = false;

  function drawWheel() {
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);
    stories.forEach((s, i) => {
      const start = i * slice;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.save();
      ctx.rotate(start + slice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#2c1b3d";
      ctx.font = "22px sans-serif";
      ctx.fillText(s.emoji, radius - 14, 6);
      ctx.restore();
    });
    ctx.restore();
  }

  function spin() {
    if (spinning) return;
    spinning = true;
    resultEl.textContent = "";
    const targetIndex = Math.floor(Math.random() * stories.length);
    const targetSlice = targetIndex * slice + slice / 2;
    const extraTurns = 6 * Math.PI * 2;
    const finalRotation = extraTurns + (Math.PI * 2 - targetSlice) - Math.PI / 2;

    const duration = 4200;
    const startRotation = rotation % (Math.PI * 2);
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      rotation = startRotation + eased * finalRotation;
      drawWheel();
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        const story = stories[targetIndex];
        resultEl.innerHTML = `${story.emoji} <strong>${story.title}</strong> — <a href="/stories/${data.lang}/story-${story.id}.html">${data.ui.wheel_go}</a>`;
        burstConfetti();
      }
    }
    requestAnimationFrame(animate);
  }

  drawWheel();
  spinBtn.addEventListener("click", spin);
}
