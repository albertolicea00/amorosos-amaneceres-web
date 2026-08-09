// Scope: storyCards — renders the 8-card grid and footer story lists
// from i18n data (never hardcodes titles/paths outside this module).
// Each card is the story's cover art (title already baked into the image); 
// the whole card is one link, no separate "read" button.

export function renderStoryCards(data) {
  const grid = document.getElementById("storiesGrid");
  if (!grid) return;
  const lang = data.lang;
  grid.innerHTML = data.stories
    .map(
      (s) => `
    <a class="story-card" href="/stories/${lang}/story-${s.id}.html" style="background-image:url('/assets/stories/${lang}/story-cover-${s.id}.webp')">
      <span class="value-ribbon">${s.value}</span>
    </a>
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
