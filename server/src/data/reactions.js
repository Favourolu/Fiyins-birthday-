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
  "Wait... what did you even study again?",
  "Okay show-off.",
  "Suspiciously confident for someone I haven't graded yet.",
  "Lucky guess or certified genius? We'll never know.",
  "Don't let that go to your head.",
  "Ten points to wherever you went to school.",
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
  "What did you even study for this?",
  "That's a choice. A whole choice.",
  "I have questions. Mainly about your reasoning.",
  "That answer is now part of party folklore.",
  "We'll circle back to that one... never.",
];

const neutralReactions = [
  "Locked.",
  "That's your final answer.",
  "No going back now.",
  "Decision recorded.",
  "Moving on...",
  "Interesting.",
  "What did you even study again?",
  "Bold pick. Truly bold.",
  "Okay, professor.",
  "I see we're just guessing with confidence now.",
  "Sure. Let's go with that.",
  "Noted. Moving on before I say something.",
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
