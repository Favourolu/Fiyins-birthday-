// Deliberately ambiguous reactions shown right after a participant locks in
// an answer. NONE of these reveal whether the answer was actually correct —
// that's the point. The neutral pool is drawn from regardless of
// correctness, and even the correct/incorrect pools are worded so a
// participant can't reliably tell them apart.

const correctReactions = [
  "Hmm... interesting choice.",
  "You seem very confident about that one \u{1F440}",
  "That's certainly... a choice.",
  "Bold.",
  "Interesting. Very interesting.",
  "I hope you didn't overthink that.",
  "Okay, we're locking that in.",
  "No going back now.",
];

const incorrectReactions = [
  "Oh no. You really went with that one? \u{1F62D}",
  "Locked. I'm not saying anything.",
  "Interesting strategy.",
  "Well... confidence is important.",
  "You know what? Let's just keep going.",
  "That answer has officially been submitted to history.",
  "I'm sure you had your reasons.",
  "The commitment is admirable.",
];

const neutralReactions = [
  "Locked.",
  "That's your final answer.",
  "No going back now.",
  "Decision recorded.",
  "Moving on...",
  "Interesting.",
];

// Neutral reactions are used often so correctness can never be inferred
// from which pool showed up. `lastReaction` is excluded from the candidate
// set so the same line never repeats back-to-back.
function pickReaction(isCorrect, lastReaction) {
  const useNeutral = Math.random() < 0.5;
  const pool = useNeutral ? neutralReactions : isCorrect ? correctReactions : incorrectReactions;

  let candidates = pool.filter((r) => r !== lastReaction);
  if (candidates.length === 0) candidates = pool;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

module.exports = { pickReaction, correctReactions, incorrectReactions, neutralReactions };
