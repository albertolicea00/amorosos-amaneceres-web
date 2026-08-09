// Scope: quiz — personality quiz that maps answers to a story.

import { burstConfetti } from "./confetti.js";
import { characterImg } from "./characterSlug.js";

function showQuizStep(i) {
  document.querySelectorAll(".quiz-step").forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.step) === i);
  });
}

function finishQuiz(data, scores) {
  let winnerId = data.stories[0].id;
  let best = -1;
  Object.entries(scores).forEach(([id, val]) => {
    if (val > best) {
      best = val;
      winnerId = Number(id);
    }
  });
  const story = data.stories.find((s) => s.id === winnerId) || data.stories[0];

  document.getElementById("quizSteps").style.display = "none";
  document.getElementById("quizProgress").style.display = "none";
  const resultEl = document.getElementById("quizResult");
  resultEl.classList.add("active");
  document.getElementById("quizGlyph").innerHTML = characterImg(story.id, story.emoji);
  document.getElementById("quizAnimal").textContent = story.title;
  document.getElementById("quizDesc").textContent = data.ui.quiz_desc_template
    .replace("{animal}", story.animal.toLowerCase())
    .replace("{value}", story.value);
  const link = document.getElementById("quizStoryLink");
  link.href = `/stories/${data.lang}/story-${story.id}.html`;
  link.textContent = data.ui.quiz_cta;

  burstConfetti();
}

function renderQuiz(data) {
  const stepsEl = document.getElementById("quizSteps");
  const progressEl = document.getElementById("quizProgress");
  if (!stepsEl || !progressEl) return;
  const questions = data.quiz.questions;
  const scores = {};

  stepsEl.innerHTML = questions
    .map(
      (q, i) => `
    <div class="quiz-step" data-step="${i}">
      <p><strong>${q.q}</strong></p>
      <div class="quiz-options">
        ${q.options.map((o, oi) => `<button type="button" data-step="${i}" data-opt="${oi}">${o.text}</button>`).join("")}
      </div>
    </div>
  `
    )
    .join("");

  progressEl.innerHTML = questions.map(() => `<span></span>`).join("");

  document.getElementById("quizResult").classList.remove("active");
  stepsEl.style.display = "";
  progressEl.style.display = "";
  showQuizStep(0);

  stepsEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stepIdx = Number(btn.dataset.step);
      const optIdx = Number(btn.dataset.opt);
      const chosen = questions[stepIdx].options[optIdx];
      Object.entries(chosen.score).forEach(([id, val]) => {
        scores[id] = (scores[id] || 0) + val;
      });
      const progress = progressEl.children;
      if (progress[stepIdx]) progress[stepIdx].classList.add("done");

      if (stepIdx + 1 < questions.length) {
        showQuizStep(stepIdx + 1);
      } else {
        finishQuiz(data, scores);
      }
    });
  });
}

export function initQuiz(data) {
  renderQuiz(data);
  const restartBtn = document.getElementById("quizRestart");
  if (restartBtn) restartBtn.addEventListener("click", () => renderQuiz(data));
}
