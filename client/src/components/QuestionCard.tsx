import { motion } from "framer-motion";
import type { Question } from "../lib/api";

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

export default function QuestionCard({
  question,
  selected,
  onSelect,
  direction,
}: {
  question: Question;
  selected: string | null;
  onSelect: (value: string) => void;
  direction: 1 | -1;
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 * direction }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-birthday-gold/80">
        {question.section}
      </p>
      <h2 className="mt-3 font-[var(--font-display)] text-xl font-medium leading-snug text-birthday-blush sm:text-2xl">
        {question.question}
      </h2>

      <div role="radiogroup" aria-label={`Question ${question.id} options`} className="mt-6 space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-base transition ${
                isSelected
                  ? "border-birthday-magenta bg-birthday-magenta/15 text-birthday-blush shadow-[0_0_0_1px_rgba(217,70,200,0.6)]"
                  : "border-white/10 bg-white/5 text-birthday-blush/85 hover:border-white/25 hover:bg-white/10"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  isSelected
                    ? "border-birthday-magenta bg-birthday-magenta text-white"
                    : "border-white/20 text-birthday-blush/60"
                }`}
              >
                {OPTION_LETTERS[idx] ?? idx + 1}
              </span>
              <span className="flex-1">{option}</span>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-birthday-magenta"
                  aria-hidden="true"
                >
                  ✓
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
