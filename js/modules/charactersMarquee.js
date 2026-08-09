// Scope: charactersMarquee — the character strip is a real native
// scroll container (wheel/touch/drag all work); this drives a slow
// auto-advance on top of that, pausing while the user is actively
// scrolling/dragging/hovering, and wraps seamlessly since the
// track's content is duplicated once (see html/{es,en}/index.html).
// It also scales/lifts whichever card sits nearest the horizontal
// center, tapering off toward the edges.

const AUTO_SPEED_PX_PER_FRAME = 0.35;
const INTERACTION_COOLDOWN_MS = 1600;

export function initCharactersMarquee() {
  const scrollEl = document.querySelector(".characters-scroll");
  const track = scrollEl?.querySelector(".characters-track");
  if (!scrollEl || !track) return;
  const cards = Array.from(track.querySelectorAll(".character-card"));
  if (!cards.length) return;

  let halfWidth = 0;
  function measure() {
    halfWidth = track.scrollWidth / 2;
  }
  measure();
  window.addEventListener("resize", measure);

  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let hovering = false;
  let interacting = false;
  let interactTimer = null;

  function markInteracting() {
    interacting = true;
    clearTimeout(interactTimer);
    interactTimer = setTimeout(() => {
      interacting = false;
    }, INTERACTION_COOLDOWN_MS);
  }

  scrollEl.addEventListener("pointerdown", (e) => {
    dragging = true;
    scrollEl.classList.add("dragging");
    dragStartX = e.clientX;
    dragStartScroll = scrollEl.scrollLeft;
    markInteracting();
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    scrollEl.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
    markInteracting();
  });
  window.addEventListener("pointerup", () => {
    dragging = false;
    scrollEl.classList.remove("dragging");
  });
  scrollEl.addEventListener("wheel", markInteracting, { passive: true });
  scrollEl.addEventListener("touchstart", markInteracting, { passive: true });
  scrollEl.addEventListener("mouseenter", () => {
    hovering = true;
  });
  scrollEl.addEventListener("mouseleave", () => {
    hovering = false;
  });

  function tick() {
    if (halfWidth > 0) {
      if (!dragging && !hovering && !interacting) {
        scrollEl.scrollLeft += AUTO_SPEED_PX_PER_FRAME;
      }
      if (scrollEl.scrollLeft >= halfWidth) {
        scrollEl.scrollLeft -= halfWidth;
      } else if (scrollEl.scrollLeft < 0) {
        scrollEl.scrollLeft += halfWidth;
      }
    }

    const containerRect = scrollEl.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const maxDist = containerRect.width / 2 || 1;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const proximity = Math.max(0, 1 - Math.abs(cardCenter - centerX) / maxDist);
      const scale = 1 + proximity * 0.3;
      const lift = proximity * 14;
      card.style.transform = `translateY(-${lift}px) scale(${scale})`;
      card.style.zIndex = String(1 + Math.round(proximity * 10));
    });

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
