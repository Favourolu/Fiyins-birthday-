import { motion, AnimatePresence } from "framer-motion";

export default function SubmitModal({
  open,
  onCancel,
  onConfirm,
  submitting,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  submitting: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-birthday-ink p-7 text-center shadow-2xl"
          >
            <h2 id="submit-modal-title" className="font-[var(--font-display)] text-2xl font-semibold text-birthday-blush">
              Ready to submit?
            </h2>
            <p className="mt-3 text-sm text-birthday-blush/70">
              You've reached the end of the test. Once you submit, your answers will be locked and your
              result will be revealed.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={onConfirm}
                disabled={submitting}
                className="flex-1 rounded-full bg-gradient-to-r from-birthday-magenta to-birthday-violet px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Test"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="flex-1 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-birthday-blush/80 transition hover:bg-white/5"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
