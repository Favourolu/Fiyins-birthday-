import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REVEAL_DELAY_MS = 450;
const MIN_CONTINUE_DELAY_MS = 550;

export default function ReactionOverlay({
  reaction,
  onContinue,
}: {
  reaction: string;
  onContinue: () => void;
}) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [phase, setPhase] = useState<"locked" | "reaction">(reduced ? "reaction" : "locked");
  const [canContinue, setCanContinue] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const revealTimer = setTimeout(() => setPhase("reaction"), REVEAL_DELAY_MS);
    const continueTimer = setTimeout(() => setCanContinue(true), MIN_CONTINUE_DELAY_MS);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(continueTimer);
    };
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-birthday-ink px-7 py-9 text-center shadow-2xl">
        <AnimatePresence mode="wait">
          {phase === "locked" ? (
            <motion.p
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glitch-text font-[var(--font-display)] text-2xl font-bold uppercase tracking-[0.15em] text-birthday-gold"
            >
              Answer Locked
            </motion.p>
          ) : (
            <motion.div
              key="reaction"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-birthday-gold/70">
                Answer Locked
              </p>
              <p className="mt-4 text-lg text-birthday-blush">{reaction}</p>
              <button
                type="button"
                onClick={onContinue}
                disabled={!canContinue}
                className="mt-7 w-full rounded-full bg-gradient-to-r from-birthday-magenta to-birthday-violet px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
