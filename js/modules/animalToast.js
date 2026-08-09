// Scope: animalToast — clicking a roster card (/characters.html) plays
// that animal's sound from assets/sounds/animals/{slug}.mp3, bursts the
// confetti streamers, and slides up a bottom toast with its name. Sound
// is best-effort: not every slug in i18n/characters.json has a
// recording yet, so a missing file just means no sound, never a
// broken click.

import { burstConfetti } from "./confetti.js";

const TOAST_DURATION_MS = 7000;

const audioCache = {};

function playAnimalSound(slug) {
  if (!audioCache[slug]) {
    audioCache[slug] = new Audio(`/assets/sounds/animals/${slug}.mp3`);
  }
  const audio = audioCache[slug];
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

let toastEl = null;
let toastTimer = null;

function showAnimalToast(name) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "animal-toast";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = name;
  toastEl.classList.remove("show");
  void toastEl.offsetWidth;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), TOAST_DURATION_MS);
}

export function initRosterSounds() {
  const grid = document.querySelector(".roster-grid");
  if (!grid) return;
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".roster-card");
    if (!card) return;
    const { slug } = card.dataset;
    const name = card.querySelector(".roster-name")?.textContent ?? "";
    playAnimalSound(slug);
    showAnimalToast(name);
    burstConfetti();
  });
}
