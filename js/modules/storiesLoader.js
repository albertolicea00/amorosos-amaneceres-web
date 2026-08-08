// Scope: storiesLoader — fetches each /stories/{lang}/story-{id}.html page
// and lifts its #story-content article so the 3D book never duplicates
// story text: the plain HTML page stays the single source of truth.

export async function fetchStoryContent(lang, id) {
  const res = await fetch(`/stories/${lang}/story-${id}.html`);
  if (!res.ok) throw new Error(`Could not load story ${lang}/${id}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const article = doc.getElementById("story-content");
  if (!article) throw new Error(`story-${id}.html has no #story-content`);
  const psychology = doc.querySelector(".story-psychology");
  return {
    id,
    title: article.dataset.title || "",
    animal: article.dataset.animal || "",
    value: article.dataset.value || "",
    psychology: psychology ? psychology.textContent.trim() : "",
    bodyHtml: article.innerHTML,
  };
}

export async function fetchAllStories(lang, meta) {
  return Promise.all(meta.map((s) => fetchStoryContent(lang, s.id)));
}

export function buildPageElement(story, emoji) {
  const div = document.createElement("div");
  div.className = "book-page-surface";
  div.innerHTML = `
    <span class="bp-eyebrow">${emoji} ${story.animal}</span>
    <h2>${story.title}</h2>
    <p class="bp-tags">${story.value}</p>
    <p class="bp-psychology">${story.psychology}</p>
    <div class="bp-body">${story.bodyHtml}</div>
  `;
  return div;
}

export function buildCoverElement(coverTitle, subtitle) {
  const div = document.createElement("div");
  div.className = "book-page-surface bp-cover";
  div.innerHTML = `
    <div class="bp-cover-glyph">🌅🐢🐝🐑</div>
    <h1>${coverTitle}</h1>
    <p>${subtitle}</p>
  `;
  return div;
}
