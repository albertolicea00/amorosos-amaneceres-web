// Scope: storyCards — renders the 8-card grid and footer story lists
// from i18n data (never hardcodes titles/paths outside this module).

export function renderStoryCards(data) {
  const grid = document.getElementById("storiesGrid");
  if (!grid) return;
  const lang = data.lang;
  grid.innerHTML = data.stories
    .map(
      (s) => `
    <div class="story-card">
      <div class="emoji">${s.emoji}</div>
      <span class="value-tag">${s.value}</span>
      <h3>${s.title}</h3>
      <div class="card-links">
        <a href="/stories/${lang}/story-${s.id}.html">${data.ui.card_read}</a>
      </div>
    </div>
  `
    )
    .join("");
}

export function renderFooterLists(esData, enData) {
  const es = document.getElementById("footerStoriesEs");
  const en = document.getElementById("footerStoriesEn");
  if (es && esData) {
    es.innerHTML = esData.stories
      .map((s) => `<li><a href="/stories/es/story-${s.id}.html">${s.title}</a></li>`)
      .join("");
  }
  if (en && enData) {
    en.innerHTML = enData.stories
      .map((s) => `<li><a href="/stories/en/story-${s.id}.html">${s.title}</a></li>`)
      .join("");
  }
}
