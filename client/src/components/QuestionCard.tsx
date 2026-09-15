import { motion } from "framer-motion";
import type { Question } from "../lib/api";
import PixelBurst from "./PixelBurst";

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

export default function QuestionCard({
  question,
  pendingSelection,
  lockedAnswer,
  onSelect,
  direction,
  burstOn,
}: {
  question: Question;
  pendingSelection: string | null;
  lockedAnswer: string | null;
  onSelect: (value: string) => void;
  direction: 1 | -1;
  burstOn: string | null;
}) {
  const isLocked = lockedAnswer !== null;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 * direction }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-birthday-gold/80">
          {question.section}
        </p>
        {isLocked && (
          <span className="rounded-full border border-birthday-gold/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-birthday-gold/80">
            Locked
          </span>
        )}
      </div>
      <h2 className="mt-3 font-[var(--font-display)] text-xl font-medium leading-snug text-birthday-blush sm:text-2xl">
        {question.question}
      </h2>

      <div role="radiogroup" aria-label={`Question ${question.id} options`} className="mt-6 space-y-3">
        {question.options.map((option, idx) => {
          const isChosen = isLocked ? lockedAnswer === option : pendingSelection === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={isLocked}
              onClick={() => !isLocked && onSelect(option)}
              className={`relative flex w-full items-center gap-3 overflow-visible rounded-2xl border px-4 py-3.5 text-left text-base transition ${
                isChosen && isLocked
                  ? "border-birthday-gold/60 bg-birthday-gold/10 text-birthday-blush"
                  : isChosen
                    ? "border-birthday-magenta bg-birthday-magenta/15 text-birthday-blush shadow-[0_0_0_1px_rgba(217,70,200,0.6)]"
                    : isLocked
                      ? "border-white/5 bg-white/[0.02] text-birthday-blush/30"
                      : "border-white/10 bg-white/5 text-birthday-blush/85 hover:border-white/25 hover:bg-white/10"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  isChosen && isLocked
                    ? "border-birthday-gold bg-birthday-gold text-birthday-void"
                    : isChosen
                      ? "border-birthday-magenta bg-birthday-magenta text-white"
                      : "border-white/20 text-birthday-blush/60"
                }`}
              >
                {OPTION_LETTERS[idx] ?? idx + 1}
              </span>
              <span className="flex-1">{option}</span>
              {isChosen && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={isLocked ? "text-birthday-gold" : "text-birthday-magenta"}
                  aria-hidden="true"
                >
                  {isLocked ? "\u{1F512}" : "✓"}
                </motion.span>
              )}
              {isChosen && <PixelBurst active={burstOn === option} />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
