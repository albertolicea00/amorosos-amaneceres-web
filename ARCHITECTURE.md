# Architecture — Amorosos Amaneceres

Static site. No Node, no bundler, no build step. Every file here is served as-is by any basic static host (Netlify, GitHub Pages, S3, plain Apache/nginx). The only requirement is that it's served over **HTTP(S)**, not opened via `file://` — `fetch()` and ES modules both require it.

## Stack

- **HTML5** — hand-written, one file per route.
- **CSS3** — custom properties, flexbox/grid, no preprocessor.
- **JavaScript (ES modules)** — native `<script type="module">`, no transpiler.
- **Three.js** (`WebGLRenderer` + `CSS3DRenderer` addon) + **GSAP** (`ScrollTrigger`) — loaded from CDN (unpkg) on `/read.html` only, via an import map. Not used anywhere else.

## Routing

Language is a **route**, not a client-side toggle — chosen for SEO (each language gets its own crawlable, indexable URL with `hreflang` alternates), per explicit direction.

| Path | Content |
|---|---|
| `/index.html` (root) | Landing page, Spanish (default) |
| `/en/index.html` | Landing page, English |
| `/stories/es/story-{1-8}.html` | One story, Spanish, full text |
| `/stories/en/story-{1-8}.html` | Same story, English, full text |
| `/read.html?story={1-8}&lang={es\|en}` | The 3D scroll-reader — one shared app-like route, language/story selected by query string (not a route prefix, since it's an interactive shell rather than indexable content) |

Internal navigation links are **root-relative** (`/stories/es/story-1.html`, not `../stories/...`) so the same generated link works correctly regardless of how deep the linking page sits (`/`, `/en/`, `/stories/es/`) — this is what lets `js/modules/storyCards.js` etc. build one `href` template rather than one per page depth.

Landing pages are static per language (no JS text-swapping) so search engines see real Spanish/English HTML on first load. Story pages are static per language for the same reason. Only page-load-time widgets (the wheel, the quiz, dynamic story cards) are populated by JS.

## Content model — single source of truth

Each `/stories/{lang}/story-N.html` is the **only** place a story's text lives. Nothing else duplicates it:

- `/read.html` fetches the plain story page via `fetch()`, parses it with `DOMParser`, and lifts `#story-content`'s HTML straight into the 3D book (`js/modules/storiesLoader.js`). Edit the story page, the 3D reader updates automatically — no second copy to keep in sync.
- The story `<article id="story-content">` carries `data-title` / `data-animal` / `data-value` attributes precisely so the loader doesn't have to re-parse prose to get metadata.

## i18n

Two layers, deliberately different mechanisms for different content:

1. **Page copy** (headings, nav labels, story text) — hand-authored per language, directly in each HTML file. Nothing to fetch, nothing to render client-side, nothing to flash-of-untranslated-content.
2. **Dynamic UI data** (story card grid, footer story lists, wheel labels, quiz questions) — lives in `/i18n/es.json` and `/i18n/en.json`, fetched at runtime by `js/modules/i18n.js`. This is the data these widgets need to exist at all (an 8-item array to loop over, quiz questions to render) — it can't be static markup the way page copy can.

`getPageLang()` resolves the active language as: `?lang=` query param (used by `/read.html`) → falls back to `window.SITE_LANG` (a one-line inline `<script>` each landing/story page sets before loading the module).

## JS module map

Everything is a small, single-purpose ES module under `js/modules/`; the two files at `js/` root are just entry points that import and wire them together — no logic of their own.

```
js/main.js                      landing-page entry (index.html, en/index.html)
├─ modules/i18n.js               getPageLang(), loadI18n()
├─ modules/navbar.js             scroll shadow + mobile menu
├─ modules/reveal.js             IntersectionObserver fade-in
├─ modules/storyCards.js         8-card grid + footer story lists
├─ modules/wheel.js              canvas "ruleta" wheel-of-fortune
├─ modules/quiz.js               personality quiz → story recommendation
└─ modules/langDropdown.js       open/close for the ES/EN dropdown

js/read.js                      3D reader entry (read.html)
├─ modules/i18n.js               (shared)
├─ modules/storiesLoader.js      fetch + parse story HTML into page data
├─ modules/book3d.js             Three.js scene + CSS3D overlay + page-turn math
└─ modules/langDropdown.js       (shared)
```

## The 3D reader (`read.html`)

Two mirrored Three.js scenes sharing one camera:

- **`scene`** (rendered by `WebGLRenderer`) holds the *physical* book: a plane mesh per page, a spine, a back cover, lit by an ambient + warm key + cool rim light.
- **`sceneCSS`** (rendered by `CSS3DRenderer`) holds one `CSS3DObject` per page wrapping a real HTML `<div>` with the story's actual text — so the words stay crisp, selectable, and reflowable instead of being baked into a texture.

Each page has **two** pivot groups (one per scene, same local transform) because a `THREE.Object3D` can only belong to one parent/scene; every frame, `book3d.js` sets identical `rotation.y` on both so the WebGL page and its CSS3D text stay glued together as they turn.

Page-turning is scroll-driven: a tall spacer (`#scrollTrack`) drives a single `ScrollTrigger` with `scrub`, pinning the viewport; `onUpdate` maps scroll progress to a float across all pages and rotates each page's pivot by `clamp(progress - pageIndex, 0, 1) * -180°`. Deep-linking to `?story=N` computes the matching scroll offset and jumps there on load.

## Known constraints

- Fixed pixel page size (520×640) for correct WebGL/CSS3D alignment — on very small phones the book page scales down via CSS but doesn't reflow the 3D layout; a fully responsive 3D scene would need to recompute geometry + camera distance on resize, out of scope for this pass.
- Ad slots, Amazon affiliate link, and PayPal/Ko-fi/Patreon links are **placeholders** — swap in real IDs/URLs before launch.
