# Design — Amorosos Amaneceres

## Concept

The book is eight bedtime stories, each pairing an animal with a human value, closing on the same line every time: *"¡Hasta mañana! ¡Que tengas dulces sueños!"* — the site's whole visual language is built around that closing image: a sunrise ("amanecer") after a night of stories.

## Palette

Warm dawn gradient for anything "daytime" (hero, cards, CTAs); a deeper dusk/plum for text, footers, and the 3D reader's backdrop (an actual amanecer needs a night to rise out of).

| Token | Hex | Use |
|---|---|---|
| `--dawn-1` → `--dawn-4` | `#ffe3b3` → `#f3617a` | Hero gradient, accents, wheel slices |
| `--dusk-1` / `--dusk-2` | `#8a5aa8` / `#4a3170` | Headings on light backgrounds, CTA band, reader backdrop |
| `--ink` | `#2c1b3d` | Body text |
| `--cream` / `--cream-2` | `#fff8ef` / `#fff1de` | Page + card backgrounds |
| `--gold` / `--gold-soft` | `#f4a259` / `#ffd89a` | Small accents, sun glow, key light in the 3D scene |

## Type

- **Fraunces** (display serif, variable optical size) for headings and the book's own title — a storybook needs a serif with warmth, not a geometric sans.
- **Quicksand** (rounded sans) for body copy and UI — soft shapes matching the audience (children being read to) without going full "kiddie font."

## Layout system

`--radius-lg/md/sm` (28/18/10px) and two shadow tokens (`--shadow-soft`, `--shadow-card`) are the only two things every card, button, and panel pulls from — so the whole site reads as one material (soft-edged paper) rather than a grab-bag of components. See `css/tokens.css`.

## Landing page flow

1. **Hero** — the pitch in one screen: title, one-line promise, the two calls to action that matter (read now / buy), a floating "book" mockup.
2. **About** — who this is for and why (values, not just a story list).
3. **Stories grid** — the actual product: 8 cards, each with a value tag, a title, and two ways in (plain read vs. 3D). This is the page's real job; everything else is framing.
4. **Play** — the wheel and the quiz exist to solve "I don't know which story to pick," turning indecision into a two-click path to a specific story.
5. **Buy** — a single, calm CTA band, not a hard sell — the free 3D reader sits right next to the Amazon link on purpose, so "buy" reads as a preference, not a paywall.
6. Ad slots are placed at natural scroll pauses (after hero, mid stories-grid, before footer) rather than interrupting the story cards themselves.

## The 3D reader

Designed to feel like *opening a book*, not like a slideshow: a closed cover facing the reader, one continuous scroll turning pages front-to-back, a jump row along the bottom for anyone who wants to skip straight to a story instead of scrolling through all eight. Text lives in real, readable HTML (not a texture), so it can be selected, scaled by the browser's zoom, and read by a screen reader.

## Gamification

Two entry points into the same 8 stories, deliberately different in feel:

- **Wheel** — pure chance, for "surprise me tonight."
- **Quiz** — five short questions, lightly weighted per story, for "tell me which one is *me*." Neither is meant to be a rigorous personality test — five questions is enough to feel personal without feeling like homework.

## What's still a placeholder

Ad slot containers, the Amazon link, and the PayPal/Ko-fi/Patreon links are visually finished but point at generic URLs — they need the real affiliate link and account handles before this ships.
