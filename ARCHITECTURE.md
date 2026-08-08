# Architecture — Amorosos Amaneceres

Static site. No Node, no bundler, no build step. Every file here is served as-is by any basic static host (Netlify, GitHub Pages, S3, plain Apache/nginx). The only requirement is that it's served over **HTTP(S)**, not opened via `file://` — `fetch()` and ES modules both require it.

## Stack

- **HTML5** — hand-written, one file per route.
- **CSS3** — custom properties, flexbox/grid, no preprocessor.
- **JavaScript (ES modules)** — native `<script type="module">`, no transpiler.

## Routing

Language is a **route**, not a client-side toggle — chosen for SEO (each language gets its own crawlable, indexable URL with `hreflang` alternates), per explicit direction.

| Path | Content |
|---|---|
| `/index.html` (root) | Landing page, Spanish (default) |
| `/en/index.html` | Landing page, English |
| `/stories/es/story-{1-8}.html` | One story, Spanish, full text |
| `/stories/en/story-{1-8}.html` | Same story, English, full text |

Internal navigation links are **root-relative** (`/stories/es/story-1.html`, not `../stories/...`) so the same generated link works correctly regardless of how deep the linking page sits (`/`, `/en/`, `/stories/es/`) — this is what lets `js/modules/storyCards.js` etc. build one `href` template rather than one per page depth.

Landing pages are static per language (no JS text-swapping) so search engines see real Spanish/English HTML on first load. Story pages are static per language for the same reason. Only page-load-time widgets (the wheel, the quiz, dynamic story cards) are populated by JS.

"Leer online" / "Read online" links (nav, hero, buy band) all point to `#stories` — there is a single reading mode (the plain story page), so every entry point converges on the stories grid.

## Content model — single source of truth

Each `/stories/{lang}/story-N.html` is the **only** place a story's text lives — one file, one language, no duplication anywhere else. The story `<article id="story-content">` carries `data-title` / `data-animal` / `data-value` attributes describing itself, but nothing outside that file re-renders its prose.

## i18n

Two layers, deliberately different mechanisms for different content:

1. **Page copy** (headings, nav labels, story text) — hand-authored per language, directly in each HTML file. Nothing to fetch, nothing to render client-side, nothing to flash-of-untranslated-content.
2. **Dynamic UI data** (story card grid, footer story list, wheel labels, quiz questions) — lives in `/i18n/es.json` and `/i18n/en.json`, fetched at runtime by `js/modules/i18n.js`. This is the data these widgets need to exist at all (an 8-item array to loop over, quiz questions to render) — it can't be static markup the way page copy can.

`getPageLang()` resolves the active language from `window.SITE_LANG` (a one-line inline `<script>` each landing/story page sets before loading the module).

## JS module map

Everything is a small, single-purpose ES module under `js/modules/`; `js/main.js` is the one entry point (loaded by the two landing pages) that imports and wires them together, and `js/story.js` is a much smaller entry point (loaded by every story page) that only wires up the language dropdown.

```
js/main.js                      landing-page entry (index.html, en/index.html)
├─ modules/i18n.js               getPageLang(), loadI18n()
├─ modules/navbar.js             scroll shadow + mobile menu
├─ modules/reveal.js             IntersectionObserver fade-in
├─ modules/storyCards.js         8-card grid + footer story list
├─ modules/wheel.js              canvas "ruleta" wheel-of-fortune
├─ modules/quiz.js               personality quiz → story recommendation
├─ modules/confetti.js           canvas streamer burst (wheel + quiz)
└─ modules/langDropdown.js       open/close for the ES/EN dropdown

js/story.js                     story-page entry (stories/{es,en}/story-N.html)
└─ modules/langDropdown.js       (shared)
```

## Known constraints

- Ad slots, Amazon affiliate link, and PayPal/Ko-fi/Patreon links are **placeholders** — swap in real IDs/URLs before launch.
- Not every story has a matching animal illustration in `assets/img/animal/v2/` yet (only ant, duck, rabbit, butterfly exist) — this doesn't currently surface anywhere in the UI, but keep it in mind if animal imagery gets reintroduced elsewhere.
