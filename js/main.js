// ============================================================
// Amorosos Amaneceres — main.js (entry module)
// Loaded via <script type="module">. Orchestrates the small
// module set in js/modules/*.js; holds no logic of its own.
// ============================================================

import { getPageLang, loadI18n } from "./modules/i18n.js";
import { initNavbar } from "./modules/navbar.js";
import { initReveal } from "./modules/reveal.js";
import { renderStoryCards, renderFooterLists } from "./modules/storyCards.js";
import { initWheel } from "./modules/wheel.js";
import { initQuiz } from "./modules/quiz.js";
import { initLangDropdowns } from "./modules/langDropdown.js";

document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();
  initReveal();
  initLangDropdowns();

  const lang = getPageLang();
  const otherLang = lang === "es" ? "en" : "es";
  const [ownData, otherData] = await Promise.all([loadI18n(lang), loadI18n(otherLang)]);

  renderStoryCards(ownData);
  renderFooterLists(lang === "es" ? ownData : otherData, lang === "en" ? ownData : otherData);
  initWheel(ownData);
  initQuiz(ownData);
});
