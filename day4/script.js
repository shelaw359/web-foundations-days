// ----- Select elements -----
const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// ----- Constants -----
const MAX_CHARS = 200;
const WARNING_AT = 180;
const DRAFT_KEY = "draft";
const THEME_KEY = "theme";

// ----- Counters -----
function updateCounts() {
  const text = noteText.value;
  const chars = text.length;
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  charCount.textContent = `${chars} / ${MAX_CHARS} characters`;
  wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;

  charCount.classList.toggle("warning", chars > WARNING_AT && chars <= MAX_CHARS);
  charCount.classList.toggle("over", chars > MAX_CHARS);
}

// ----- Draft -----
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, noteText.value);
}

function restoreDraft() {
  const saved = localStorage.getItem(DRAFT_KEY);
  if (saved !== null) {
    noteText.value = saved;
  }
}

function clearAll() {
  noteText.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
}

// ----- Theme -----
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

function restoreTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) === "dark");
}

// ----- Events -----
noteText.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearAll();
  }
});

clearBtn.addEventListener("click", clearAll);

themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// ----- On page load -----
restoreDraft();
restoreTheme();
updateCounts();