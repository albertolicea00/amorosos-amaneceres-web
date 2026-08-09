# Architecture — Amorosos Amaneceres

Static site. No Node, no bundler, no build step. The only requirement is that it's served over **HTTP(S)**, not opened via `file://` — `fetch()` and ES modules both require it.

## Stack

- **HTML5** — hand-written, one file per route.
- **CSS3** — custom properties, flexbox/grid, no preprocessor.
- **JavaScript (ES modules)** — native `<script type="module">`, no transpiler.

## Repo layout — pages vs. everything else

Actual HTML files live under `html/`, separate from `css/`, `js/`, `i18n/`, `assets/`, which stay at repo root:

```
html/es/index.html              Landing page, Spanish
html/es/404.html                404, Spanish
html/en/index.html              Landing page, English
html/en/404.html                404, English
html/stories/es/story-{1-8}.html   One story, Spanish, full text
html/stories/en/story-{1-8}.html   Same story, English, full text
css/  js/  i18n/  assets/       shared by every page above, at real root paths
```

**This split only works because of `vercel.json`** — see "Deployment" below. Without it, a request for `/` would 404 (there's no `index.html` at the actual repo root).

## Deployment (Vercel)

`vercel.json` rewrites clean public URLs to their real file location under `html/`:

| Public URL                       | Actually serves                      |
| -------------------------------- | ------------------------------------ |
| `/` , `/index.html`              | `html/es/index.html`                 |
| `/en` , `/en/index.html`         | `html/en/index.html`                 |
| `/stories/{es\|en}/story-N.html` | `html/stories/{es\|en}/story-N.html` |
| anything else under `/en/*`      | `html/en/404.html`, status 404       |
| anything else                    | `html/es/404.html`, status 404       |

`{ "handle": "filesystem" }` is the first route — it lets real static files (`/css/style.css`, `/js/main.js`, everything in `assets/`) serve directly before any rewrite is considered, since those live at their literal paths and need no remapping.

**This is Vercel-specific.** It relies on Vercel's legacy `routes` config (regex `src`/`dest` with capture groups, plus a `status` override for the 404 pair) — a different static host (Netlify, GitHub Pages, plain Apache) would need an equivalent redirect/rewrite config of its own, or the `html/` split would need to go away and pages would move back to serving from their public path directly.

**Local preview (recommended): Vercel CLI.** `npx vercel dev` runs the real `vercel.json` route table locally, so the URL bar matches production exactly — `/`, `/en`, `/stories/es/story-1.html`, and the 404 pairs all behave as they will on Vercel. See "Running locally with Vercel CLI" below.

Because internal links are root-relative (see below), a lighter alternative also works: opening any file directly — e.g. VS Code's "Open with Live Server" on `html/es/index.html` — renders correctly even though Live Server has no rewrite engine; the URL bar just shows the real file path (`/html/es/index.html`) instead of the clean one. Live Server cannot be made to mirror `vercel.json` routes.

**Deprecated: `server.js`.** A previous iteration shipped a hand-rolled zero-dependency server (`node server.js`) that re-read `vercel.json` and applied its routes in Node. The idea was to get production-faithful URLs locally without any install step. It worked, but it was a parallel reimplementation of Vercel's own routing that could drift from `vercel.json` over time. **The Vercel CLI replaces it completely** — `npx vercel dev` does exactly what `server.js` tried to do, using Vercel's own engine, so the file is kept only for historical reference and should not be used.

## Routing (public URLs)

Language is a **route**, not a client-side toggle — chosen for SEO (each language gets its own crawlable, indexable URL with `hreflang` alternates).

Internal navigation links are **root-relative** everywhere (`/stories/es/story-1.html`, `/css/style.css` — never `../` or a bare relative path) so the same generated link works regardless of page depth or how the page was reached, and so a link keeps working whether it's resolved against a clean rewritten URL or the raw file path. This is what lets `js/modules/storyCards.js` etc. build one `href` template rather than one per page depth.

Landing pages are static per language (no JS text-swapping) so search engines see real Spanish/English HTML on first load. Story pages are static per language for the same reason. Only page-load-time widgets (the wheel, the quiz, dynamic story cards) are populated by JS.

"Leer online" / "Read online" links (nav, hero, buy band) all point to `#stories` — there is a single reading mode (the plain story page), so every entry point converges on the stories grid.

## Content model — single source of truth

Each `html/stories/{lang}/story-N.html` is the **only** place a story's text lives — one file, one language, no duplication anywhere else. The story `<article id="story-content">` carries `data-title` / `data-animal` / `data-value` attributes describing itself, but nothing outside that file re-renders its prose.

## i18n

Two layers, deliberately different mechanisms for different content:

1. **Page copy** (headings, nav labels, story text) — hand-authored per language, directly in each HTML file. Nothing to fetch, nothing to render client-side, nothing to flash-of-untranslated-content.
2. **Dynamic UI data** (story card grid, footer story list, wheel labels, quiz questions) — lives in `/i18n/es.json` and `/i18n/en.json`, fetched at runtime by `js/modules/i18n.js`. This is the data these widgets need to exist at all (an 8-item array to loop over, quiz questions to render) — it can't be static markup the way page copy can.

`getPageLang()` resolves the active language from `window.SITE_LANG` (a one-line inline `<script>` each landing/story page sets before loading the module).

## JS module map

Everything is a small, single-purpose ES module under `js/modules/`; `js/main.js` is the one entry point (loaded by the two landing pages) that imports and wires them together, and `js/story.js` is a much smaller entry point (loaded by every story page) that only wires up the language dropdown.

```
js/main.js                      landing-page entry (html/es/index.html, html/en/index.html)
├─ modules/i18n.js               getPageLang(), loadI18n()
├─ modules/navbar.js             scroll shadow + mobile menu
├─ modules/reveal.js             IntersectionObserver fade-in
├─ modules/storyCards.js         8-card grid + footer story list
├─ modules/wheel.js              canvas "ruleta" wheel-of-fortune
├─ modules/quiz.js               personality quiz → story recommendation
├─ modules/confetti.js           canvas streamer burst (wheel + quiz)
└─ modules/langDropdown.js       open/close for the ES/EN dropdown

js/story.js                     story-page entry (html/stories/{es,en}/story-N.html)
└─ modules/langDropdown.js       (shared)
```

## Running locally with Vercel CLI

The Vercel CLI (`vercel`) is the one dev dependency for serving this repo — it reads `vercel.json` and applies the exact same routes as production, no separate server config needed.

| Command                             | Effect                                      |
| ----------------------------------- | ------------------------------------------- |
| `npm i -g vercel`                   | Install the CLI once (or `make install-vercel`) |
| `vercel login`                      | Authenticate (needed for `dev` and deploy)  |
| `vercel dev`                        | Serve locally at `http://localhost:3000`    |
| `vercel`                            | Preview deployment (creates a `*.vercel.app` URL) |
| `vercel --prod`                     | Production deployment                       |

Each command is also exposed as a `make` target — `make login`, `make dev`, `make preview`, `make deploy` — which runs the same Vercel CLI call with an installed-tool check first.

`vercel dev` uses Vercel's own routing engine, so local URLs are identical to production: `/`, `/en`, `/stories/es/story-1.html`, and the 404 pairs. This is the recommended local workflow; everything else below is optional tooling.

## Formatting & lint (dev tooling)

Not part of the runtime — the site still ships with zero Node deps. Tooling is opt-in, run via `npx` (no `package.json`, nothing to install).

### Tools

| Tool       | Scope          | Config file            |
| ---------- | -------------- | ---------------------- |
| Prettier   | HTML/CSS/JS    | `.prettierrc`          |
| ESLint     | `js/**/*.js`   | `eslint.config.mjs`    |
| Stylelint  | `css/**/*.css` | `.stylelintrc.json`    |

Prettier ignores `assets/`, `public/`, `book/` (see `.prettierignore`). ESLint ignores `assets/`, `public/`, `book/`, `i18n/` via the `ignores` block.

### Commands (make)

| Command           | Effect                                       |
| ----------------- | -------------------------------------------- |
| `make check`      | Show which tools are installed               |
| `make install`    | Install prettier, eslint, stylelint, vercel  |
| `make format`     | Format everything (HTML/CSS/JS)              |
| `make format-check` | Check format only, no writes               |
| `make lint-js`    | ESLint on `js/`                              |
| `make lint-css`   | Stylelint on `css/`                          |
| `make lint`       | `lint-js` + `lint-css`                       |
| `make verify`     | `format-check` + `lint` — full check, no edits |

There is no `package.json` in this repo — `make` wraps the tools directly (`make format`, `make lint`, ...), and each target tells you how to install a missing tool instead of failing silently. The raw `npx` commands work too if you prefer them. These are **dev-only** — they are not part of the site, the deploy, or any build step. The shipped artifact stays zero-Node; if you pull the repo elsewhere and never run make, nothing breaks.

### Editor

`.vscode/settings.json` wires Prettier as the default formatter with format-on-save, and enables ESLint/Stylelint validation. `.vscode/extensions.json` recommends the four extensions (Live Server, Prettier, ESLint, Stylelint).

## Known constraints

- Ad slots, Amazon affiliate link, and PayPal/Ko-fi/Patreon links are **placeholders** — swap in real IDs/URLs before launch.
- The `vercel.json` routing is load-bearing, not cosmetic — moving pages around under `html/` again, or migrating off Vercel, means updating it (or replacing it with the target host's equivalent) in the same change.
