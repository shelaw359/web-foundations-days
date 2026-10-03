// ===== Starting data =====
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const validCategories = ["personal", "work", "study"];

// ===== Helper: tidy text for comparing =====
// Trims the ends, collapses repeated spaces and lower-cases everything.
function cleanText(text) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

// ===== 1. searchNotes(word) =====
// Returns every note whose text contains the word, ignoring upper/lower case.
function searchNotes(word) {
  const term = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(term));
}

// ===== 2. longestNote() =====
// Returns the note object with the most characters, or null if there are none.
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// ===== 3. countByCategory() =====
// Returns an object such as { personal: 2, study: 2, work: 1 }.
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category] = counts[note.category] + 1;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

// ===== 4. getSummary() =====
// Returns a sentence such as "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const word = total === 1 ? "note" : "notes";
  const parts = validCategories.map(
    (category) => `${counts[category] || 0} ${category}`
  );
  return `${total} ${word}: ${parts.join(", ")}.`;
}

// ===== 5. isDuplicate(text) =====
// True if a note with the same text exists (ignoring case and extra spaces).
function isDuplicate(text) {
  const target = cleanText(text);
  return notes.some((note) => cleanText(note.text) === target);
}

// ===== 6. addNote(text, category) =====
// Adds a note only if it passes every check. Returns true if added, else false.
function addNote(text, category) {
  const cleaned = typeof text === "string" ? text.trim() : "";

  if (cleaned.length < 1 || cleaned.length > 200) {
    console.log("Not added: the text must be 1 to 200 characters long.");
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log(
      `Not added: the category must be one of ${validCategories.join(", ")}.`
    );
    return false;
  }
  if (isDuplicate(cleaned)) {
    console.log("Not added: a note with this text already exists.");
    return false;
  }

  const newId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1;
  notes.push({ id: newId, text: cleaned, category: category });
  return true;
}

// =====================================================
// TESTS (open the Console to see the results)
// The expected output is written in a comment next to each call.
// =====================================================

console.log("--- searchNotes ---");
console.log(searchNotes("milk")); // [ { id: 1, text: "Buy milk and bread", category: "personal" } ]
console.log(searchNotes("JAVASCRIPT")); // [ { id: 4, text: "Revise JavaScript arrays", category: "study" } ] (case ignored)
console.log(searchNotes("the")); // two notes: id 2 and id 3
console.log(searchNotes("xyz")); // [] (no results)

console.log("--- longestNote ---");
console.log(longestNote()); // { id: 3, text: "Email the project report to Grace", category: "work" }
const savedNotes = notes; // keep the real array safe
notes = [];
console.log(longestNote()); // null (no notes)
notes = savedNotes; // put the real array back

console.log("--- countByCategory ---");
console.log(countByCategory()); // { personal: 2, study: 2, work: 1 }
notes = [];
console.log(countByCategory()); // {} (no notes)
notes = savedNotes;

console.log("--- getSummary ---");
console.log(getSummary()); // "5 notes: 2 personal, 1 work, 2 study."
notes = [savedNotes[0]];
console.log(getSummary()); // "1 note: 1 personal, 0 work, 0 study." (singular "note")
notes = [];
console.log(getSummary()); // "0 notes: 0 personal, 0 work, 0 study."
notes = savedNotes;

console.log("--- isDuplicate ---");
console.log(isDuplicate("Buy milk and bread")); // true (exact match)
console.log(isDuplicate("   BUY   milk AND bread  ")); // true (case and extra spaces ignored)
console.log(isDuplicate("Buy eggs")); // false (new text)

console.log("--- addNote ---");
console.log(addNote("Plan the weekend trip", "personal")); // true (note added)
console.log(addNote("buy MILK and bread", "work")); // logs "Not added: a note with this text already exists." then false
console.log(addNote("", "work")); // logs "Not added: the text must be 1 to 200 characters long." then false
console.log(addNote("a".repeat(201), "work")); // logs "Not added: the text must be 1 to 200 characters long." then false (201 characters)
console.log(addNote("Learn CSS grid", "hobby")); // logs "Not added: the category must be one of personal, work, study." then false
console.log(addNote("x".repeat(200), "study")); // true (exactly 200 characters is allowed)
console.log(getSummary()); // "7 notes: 3 personal, 1 work, 3 study."
console.log(notes.length); // 7