const DAY = 864e5;
const STEPS = [1, 3, 7, 14, 30]; // days between reviews

export function applyReview(word, correct) {
  const level = correct ? Math.min(word.level + 1, STEPS.length) : 0;
  return {
    level,
    correct: word.correct + (correct ? 1 : 0),
    wrong: word.wrong + (correct ? 0 : 1),
    nextReview: Date.now() + (correct ? STEPS[level - 1] * DAY : DAY / 24),
    status: level >= 4 ? 'mastered' : 'learning',
  };
}
