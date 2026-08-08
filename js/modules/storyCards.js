// Scope: storyCards — renders the 8-card grid and footer story lists
// from i18n data (never hardcodes titles/paths outside this module).

// Filename slug per story id, matching assets/img/animal/{slug}.webp.
// Falls back to the emoji glyph via onerror if a slug has no image yet.
const ANIMAL_SLUG = {
  1: "ant",
  2: "duck",
  3: "lion",
  4: "turtle",
  5: "rabbit",
  6: "butterfly",
  7: "bee",
  8: "fox",
};

export function renderStoryCards(data) {
  const grid = document.getElementById("storiesGrid");
  if (!grid) return;
  const lang = data.lang;
  grid.innerHTML = data.stories
    .map(
      (s) => `
    <div class="story-card">
      <span class="value-ribbon">${s.value}</span>
      <div class="emoji">
        <img src="/assets/img/animal/${ANIMAL_SLUG[s.id]}.webp" alt="" onerror="this.replaceWith(document.createTextNode('${s.emoji}'))">
      </div>
      <h3>${s.title}</h3>
      <div class="card-links">
        <a href="/stories/${lang}/story-${s.id}.html">${data.ui.card_read}</a>
      </div>
    </div>
  `
    )
    .join("");
}

export function renderFooterList(data) {
  const list = document.getElementById("footerStories");
  if (!list) return;
  list.innerHTML = data.stories
    .map((s) => `<li><a href="/stories/${data.lang}/story-${s.id}.html">${s.title}</a></li>`)
    .join("");
}
