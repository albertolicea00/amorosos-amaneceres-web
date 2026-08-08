// ============================================================
// Amorosos Amaneceres — read.js (3D reader entry module)
// Reads ?story=&lang= from the URL, fetches story HTML pages
// (never duplicating their text), and drives the Three.js book
// with GSAP ScrollTrigger as the reader scrolls.
// ============================================================

import { getPageLang, loadI18n } from "./modules/i18n.js";
import { fetchAllStories, buildPageElement, buildCoverElement } from "./modules/storiesLoader.js";
import { createBook } from "./modules/book3d.js";
import { initLangDropdowns, setLangDropdownLabel } from "./modules/langDropdown.js";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

function getInitialStoryId() {
  const raw = Number(new URLSearchParams(location.search).get("story"));
  return raw >= 1 && raw <= 8 ? raw : 1;
}

function buildLangSwitchHrefs(storyId) {
  return {
    es: `/read.html?story=${storyId}&lang=es`,
    en: `/read.html?story=${storyId}&lang=en`,
  };
}

async function main() {
  const lang = getPageLang();
  const startId = getInitialStoryId();

  document.documentElement.lang = lang;
  const homeHref = lang === "es" ? "/index.html" : "/en/index.html";
  document.getElementById("readerHome").href = homeHref;

  const hrefs = buildLangSwitchHrefs(startId);
  const esLink = document.getElementById("readerLangEs");
  const enLink = document.getElementById("readerLangEn");
  esLink.href = hrefs.es;
  enLink.href = hrefs.en;
  (lang === "es" ? esLink : enLink).classList.add("active");
  const langDropdown = document.getElementById("readerLangDropdown");
  if (langDropdown) setLangDropdownLabel(langDropdown, lang.toUpperCase());
  initLangDropdowns();

  const data = await loadI18n(lang);
  const stories = await fetchAllStories(lang, data.stories);

  const coverTitle = lang === "es" ? "Amorosos Amaneceres" : "Amorosos Amaneceres";
  const coverSubtitle = lang === "es"
    ? "Desliza hacia abajo para pasar las páginas"
    : "Scroll down to turn the pages";

  const pageElements = [
    buildCoverElement(coverTitle, coverSubtitle),
    ...stories.map((s, i) => buildPageElement(s, data.stories[i].emoji)),
  ];

  const book = createBook({
    webglEl: document.getElementById("webgl-container"),
    cssEl: document.getElementById("css3d-container"),
    pageElements,
  });

  const track = document.getElementById("scrollTrack");
  track.style.height = `${(book.total + 1) * 100}vh`;

  const jumpRow = document.getElementById("jumpRow");
  jumpRow.innerHTML = data.stories
    .map((s) => `<button type="button" data-target="${s.id}" title="${s.title}">${s.emoji}</button>`)
    .join("");

  let st;

  function progressForStory(storyId) {
    // page 0 is the cover; story N sits at page index N.
    // (book.total - 1) turn-events are needed to walk through book.total pages.
    return storyId / (book.total - 1);
  }

  function scrollToStory(storyId) {
    const target = st.start + progressForStory(storyId) * (st.end - st.start);
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  st = ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    pin: document.getElementById("readerViewport"),
    onUpdate: (self) => {
      book.setProgress(self.progress * book.total);
      const current = Math.min(book.total, Math.max(1, Math.round(self.progress * book.total)));
      jumpRow.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("active", Number(btn.dataset.target) === current);
      });
    },
  });

  jumpRow.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => scrollToStory(Number(btn.dataset.target)));
  });

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    if (startId) scrollToStory(startId);
  });
}

main();
