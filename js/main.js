// ============================================================
// Amorosos Amaneceres — main.js (entry module)
// Loaded via <script type="module">. Orchestrates the small
// module set in js/modules/*.js; holds no logic of its own.
// ============================================================

import { getPageLang, loadI18n } from "./modules/i18n.js";
import { initNavbar } from "./modules/navbar.js";
import { initReveal } from "./modules/reveal.js";
import { renderStoryCards, renderFooterList } from "./modules/storyCards.js";
import { initWheel } from "./modules/wheel.js";
import { initQuiz } from "./modules/quiz.js";
import { initLangDropdowns } from "./modules/langDropdown.js";

document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();
  initReveal();
  initLangDropdowns();

  const lang = getPageLang();
  const ownData = await loadI18n(lang);

  renderStoryCards(ownData);
  renderFooterList(ownData);
  initWheel(ownData);
  initQuiz(ownData);
});
