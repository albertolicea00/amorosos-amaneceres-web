// Scope: animalSlug — filename slug per story id, matching
// assets/characters/{slug}.webp. Shared by storyCards, quiz, and
// wheel, which all render the same character illustration.

export const ANIMAL_SLUG = {
  1: "ant",
  2: "duck",
  3: "lion",
  4: "turtle",
  5: "rabbit",
  6: "butterfly",
  7: "bee",
  8: "sheep",
};

export function characterImg(storyId, fallbackEmoji, extraAttrs = "") {
  const slug = ANIMAL_SLUG[storyId];
  return `<img src="/assets/characters/${slug}.webp" alt="" ${extraAttrs} onerror="this.replaceWith(document.createTextNode('${fallbackEmoji}'))">`;
}
