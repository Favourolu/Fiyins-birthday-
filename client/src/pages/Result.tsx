import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import Confetti from "../components/Confetti";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, count, rounded]);

  return <>{display}</>;
}

export default function Result() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [revisit, setRevisit] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const status = await api.getStatus();
        if (!status.completed) {
          navigate("/test", { replace: true });
          return;
        }
        setResult({ score: status.score ?? 0, total: status.total, percentage: status.percentage ?? 0 });
        const seenKey = "fiyin_result_seen";
        if (sessionStorage.getItem(seenKey)) {
          setRevisit(true);
        } else {
          sessionStorage.setItem(seenKey, "1");
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError("Couldn't load your result. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-birthday-void text-birthday-blush/70">
        Calculating your result…
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-birthday-void px-6 text-center text-birthday-blush/70">
        {error ?? "No result found."}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-birthday-void px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(217,70,200,0.35),transparent_60%)]" />
      {!revisit && <Confetti />}

      {revisit && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 mb-2 text-sm text-birthday-blush/60"
        >
          You've already completed the aptitude test.
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-sm font-semibold uppercase tracking-[0.35em] text-birthday-gold"
      >
        🎉 Test Complete 🎉
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative z-10 mt-3 font-[var(--font-display)] text-3xl font-semibold text-birthday-blush sm:text-5xl"
      >
        Happy Birthday Fiyin!
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-10 flex flex-col items-center rounded-3xl border border-white/10 bg-birthday-ink/70 px-10 py-8 shadow-[0_20px_80px_rgba(217,70,200,0.25)] backdrop-blur"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-birthday-blush/60">You scored</p>
        <p className="mt-2 font-[var(--font-display)] text-5xl font-bold text-birthday-blush sm:text-6xl">
          <AnimatedNumber value={result.score} /> / {result.total}
        </p>
        <p className="mt-2 text-2xl font-semibold text-birthday-magenta">
          <AnimatedNumber value={result.percentage} />%
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative z-10 mt-8 max-w-sm text-sm text-birthday-blush/60"
      >
        Thanks for taking on the challenge — your answers have been locked in and recorded.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="relative z-10 mt-6"
      >
        <Link
          to="/leaderboard"
          className="inline-block rounded-full bg-gradient-to-r from-birthday-magenta to-birthday-violet px-7 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg transition hover:brightness-110"
        >
          View Leaderboard →
        </Link>
      </motion.div>
    </div>
  );
}
