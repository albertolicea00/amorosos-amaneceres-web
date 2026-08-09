// Scope: wheel — canvas "ruleta de la suerte" that spins to a story.
// Result card mirrors the quiz result: character image, title,
// description, a "read my story" link, and a restart button that
// re-shows the wheel instead of the result.

import { burstConfetti } from "./confetti.js";
import { characterImg } from "./animalSlug.js";

export function initWheel(data) {
  const canvas = document.getElementById("wheel-canvas");
  const spinBtn = document.getElementById("spinBtn");
  const wheelWrap = document.getElementById("wheel-wrap");
  const introEl = document.getElementById("wheelIntro");
  const resultEl = document.getElementById("wheelResult");
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

  function showResult(story) {
    if (wheelWrap) wheelWrap.style.display = "none";
    spinBtn.style.display = "none";
    if (introEl) introEl.style.display = "none";
    resultEl.classList.add("active");
    document.getElementById("wheelGlyph").innerHTML = characterImg(story.id, story.emoji);
    document.getElementById("wheelAnimal").textContent = story.title;
    document.getElementById("wheelDesc").textContent = data.ui.quiz_desc_template
      .replace("{animal}", story.animal.toLowerCase())
      .replace("{value}", story.value);
    const link = document.getElementById("wheelStoryLink");
    link.href = `/stories/${data.lang}/story-${story.id}.html`;
    link.textContent = data.ui.quiz_cta;
    burstConfetti();
  }

  function resetWheel() {
    resultEl.classList.remove("active");
    if (wheelWrap) wheelWrap.style.display = "";
    spinBtn.style.display = "";
    if (introEl) introEl.style.display = "";
  }

  function spin() {
    if (spinning) return;
    spinning = true;
    const targetIndex = Math.floor(Math.random() * stories.length);
    const targetSlice = targetIndex * slice + slice / 2;
    const TWO_PI = Math.PI * 2;

    // The pointer sits at canvas-fixed angle -PI/2 (12 o'clock). For the
    // target slice's center to land there, the wheel's rotation must
    // satisfy: targetSlice + rotation ≡ -PI/2 (mod 2π).
    const desiredFinal = -Math.PI / 2 - targetSlice;
    const currentMod = rotation % TWO_PI;
    let delta = (desiredFinal - currentMod) % TWO_PI;
    if (delta <= 0) delta += TWO_PI; // always spin forward, never backward/zero
    const extraTurns = 6 * TWO_PI;
    const finalRotation = extraTurns + delta;

    const duration = 4200;
    const startRotation = rotation;
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
        showResult(stories[targetIndex]);
      }
    }
    requestAnimationFrame(animate);
  }

  const restartBtn = document.getElementById("wheelRestart");
  if (restartBtn) restartBtn.addEventListener("click", resetWheel);

  drawWheel();
  spinBtn.addEventListener("click", spin);
}
