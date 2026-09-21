import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { api, ApiError } from "../lib/api";

const RANK_MEDAL: Record<number, string> = { 1: "\u{1F947}", 2: "\u{1F948}", 3: "\u{1F949}" };

export default function Leaderboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<
    Array<{ rank: number; displayName: string; score: number; percentage: number; isYou: boolean }>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const { leaderboard } = await api.getLeaderboard();
        setRows(leaderboard);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (err instanceof ApiError && err.status === 403) {
          navigate("/test", { replace: true });
          return;
        }
        setError("Couldn't load the leaderboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-birthday-void px-4 py-10 sm:py-16">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(124,58,237,0.3),transparent_60%)]" />

      <div className="relative z-10 mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-birthday-gold/70">
            Fiyin's Birthday Aptitude Challenge
          </p>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-birthday-blush sm:text-4xl">
            Leaderboard
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-birthday-blush/60">Loading…</p>
        ) : error ? (
          <p className="text-center text-red-300">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-center text-birthday-blush/60">No one has finished yet — check back soon.</p>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-birthday-ink/70 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur">
            {rows.map((row, i) => (
              <motion.div
                key={row.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className={`flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-0 ${
                  row.isYou ? "bg-birthday-magenta/10" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 shrink-0 text-center text-lg font-bold text-birthday-blush/60">
                    {RANK_MEDAL[row.rank] ?? row.rank}
                  </span>
                  <span
                    className={`font-medium ${row.isYou ? "text-birthday-blush" : "text-birthday-blush/85"}`}
                  >
                    {row.displayName}
                    {row.isYou && (
                      <span className="ml-2 rounded-full bg-birthday-magenta/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-birthday-magenta">
                        You
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-birthday-blush">{row.score}/17</p>
                  <p className="text-xs text-birthday-blush/50">{row.percentage}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/result"
            className="inline-block rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-birthday-blush/80 transition hover:bg-white/5"
          >
            ← Back to my result
          </Link>
        </div>
      </div>
    </div>
  );
}
