import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../lib/api";

type Row = {
  username: string;
  displayName: string;
  status: string;
  score: number | null;
  percentage: number | null;
  completedAt: string | null;
};

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { results } = await api.adminResults();
      setRows(results);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError("Couldn't load results.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await api.adminLogout().catch(() => {});
    navigate("/admin/login");
  }

  async function handleReset(row: Row) {
    const confirmed = window.confirm(
      `Reset ${row.displayName}'s session? This clears their answers/score and lets them take the test again.`
    );
    if (!confirmed) return;
    setResetting(row.username);
    try {
      await api.adminReset(row.username);
      await load();
    } catch {
      setError(`Couldn't reset ${row.displayName}.`);
    } finally {
      setResetting(null);
    }
  }

  const completedCount = rows.filter((r) => r.status === "Completed").length;

  return (
    <div className="min-h-screen bg-birthday-void px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-birthday-gold/70">Admin</p>
            <h1 className="mt-1 font-[var(--font-display)] text-3xl font-semibold text-birthday-blush">
              Results Dashboard
            </h1>
            <p className="mt-1 text-sm text-birthday-blush/60">
              {completedCount} of {rows.length} participants completed
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={load}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-birthday-blush/80 transition hover:bg-white/5"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-birthday-blush/80 transition hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-birthday-ink/60">
          {loading ? (
            <p className="p-8 text-center text-birthday-blush/60">Loading results…</p>
          ) : error ? (
            <p className="p-8 text-center text-red-300">{error}</p>
          ) : rows.length === 0 ? (
            <p className="p-8 text-center text-birthday-blush/60">No participants found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-birthday-blush/50">
                  <th className="px-5 py-3 font-medium">Participant</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Percentage</th>
                  <th className="px-5 py-3 font-medium">Reset</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.username} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3.5 text-birthday-blush">{row.displayName}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.status === "Completed"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : row.status === "In Progress"
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-white/10 text-birthday-blush/50"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-birthday-blush/80">
                      {row.score !== null ? `${row.score}/${17}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-birthday-blush/80">
                      {row.percentage !== null ? `${row.percentage}%` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {row.status === "Not Started" ? (
                        <span className="text-birthday-blush/30">—</span>
                      ) : (
                        <button
                          onClick={() => handleReset(row)}
                          disabled={resetting === row.username}
                          className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {resetting === row.username ? "Resetting…" : "Reset"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
