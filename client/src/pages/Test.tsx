import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api, ApiError, type Question } from "../lib/api";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import SubmitModal from "../components/SubmitModal";
import ReactionOverlay from "../components/ReactionOverlay";
import FloatingPixels from "../components/FloatingPixels";

function firstUnansweredIndex(questions: Question[], answers: Record<number, string>) {
  const idx = questions.findIndex((q) => !(q.id in answers));
  return idx === -1 ? Math.max(questions.length - 1, 0) : idx;
}

export default function Test() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [locking, setLocking] = useState(false);
  const [burstOn, setBurstOn] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const status = await api.getStatus();
        if (status.completed) {
          navigate("/result", { replace: true });
          return;
        }
        const { questions: qs } = await api.getQuestions();
        setQuestions(qs);
        setAnswers(status.answers ?? {});
        setIndex(firstUnansweredIndex(qs, status.answers ?? {}));
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setLoadError("Couldn't load the test. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const current = questions[index];
  const total = questions.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const lockedAnswer = current ? answers[current.id] ?? null : null;

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  function selectPending(value: string) {
    if (lockedAnswer !== null) return;
    setValidationError(null);
    setPendingSelection(value);
  }

  async function lockIn() {
    if (!current || !pendingSelection) {
      setValidationError("Please select an answer before locking it in.");
      return;
    }
    setLocking(true);
    setValidationError(null);
    try {
      const res = await api.lockAnswer(current.id, pendingSelection);
      setAnswers((prev) => ({ ...prev, [current.id]: pendingSelection }));
      setBurstOn(pendingSelection);
      setTimeout(() => setBurstOn(null), 650);
      setReaction(res.reaction);
    } catch (err) {
      setValidationError(
        err instanceof ApiError ? err.message : "Couldn't lock your answer — check your connection and try again."
      );
    } finally {
      setLocking(false);
    }
  }

  function advance() {
    if (isLast) {
      setModalOpen(true);
      return;
    }
    setDirection(1);
    setPendingSelection(null);
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function continueFromReaction() {
    setReaction(null);
    advance();
  }

  function goNext() {
    if (lockedAnswer !== null) {
      advance();
      return;
    }
    lockIn();
  }

  function goPrevious() {
    setValidationError(null);
    setPendingSelection(null);
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  }

  async function confirmSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.submit();
      navigate("/result", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Submission failed. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-birthday-void text-birthday-blush/70">
        Loading your test…
      </div>
    );
  }

  if (loadError || !current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-birthday-void px-6 text-center text-birthday-blush/70">
        {loadError ?? "No questions available."}
      </div>
    );
  }

  const isCurrentLocked = lockedAnswer !== null;

  return (
    <div className="relative min-h-screen bg-birthday-void px-4 py-10 sm:py-16">
      <FloatingPixels />
      <div className="relative z-10 mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-birthday-gold/70">
            Fiyin's Birthday Aptitude Challenge
          </p>
        </div>

        <ProgressBar current={index + 1} total={total} />

        <div className="mt-8 min-h-[22rem] rounded-3xl border border-white/10 bg-birthday-ink/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur sm:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <QuestionCard
              key={current.id}
              question={current}
              pendingSelection={pendingSelection}
              lockedAnswer={lockedAnswer}
              onSelect={selectPending}
              direction={direction}
              burstOn={burstOn}
            />
          </AnimatePresence>

          {validationError && (
            <p role="alert" className="mt-5 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {validationError}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          {!isFirst ? (
            <button
              type="button"
              onClick={goPrevious}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-birthday-blush/80 transition hover:bg-white/5"
            >
              ← Previous
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={goNext}
            disabled={locking || (!isCurrentLocked && !pendingSelection)}
            className="rounded-full bg-gradient-to-r from-birthday-magenta to-birthday-violet px-7 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {locking ? "Locking…" : isCurrentLocked ? (isLast ? "Submit Test" : "Continue →") : "Lock In"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-birthday-blush/40">{answeredCount} of {total} answered</p>
      </div>

      <AnimatePresence>
        {reaction && <ReactionOverlay reaction={reaction} onContinue={continueFromReaction} />}
      </AnimatePresence>

      <SubmitModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSubmitError(null);
        }}
        onConfirm={confirmSubmit}
        submitting={submitting}
      />
      {submitError && (
        <p role="alert" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-red-500/90 px-4 py-2 text-sm text-white shadow-lg">
          {submitError}
        </p>
      )}
    </div>
  );
}
