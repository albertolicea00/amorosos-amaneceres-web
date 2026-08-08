// Entry module for /stories/{lang}/story-N.html pages.
// These are plain content pages — the only interactive bit is
// the language dropdown in the topbar.

import { initLangDropdowns } from "./modules/langDropdown.js";

document.addEventListener("DOMContentLoaded", initLangDropdowns);
