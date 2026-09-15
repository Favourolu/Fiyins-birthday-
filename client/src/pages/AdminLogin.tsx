import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../lib/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.adminLogin(username.trim(), password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-birthday-void px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-birthday-ink/80 p-8 shadow-2xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-birthday-gold/80">
          Admin
        </p>
        <h1 className="mt-2 text-center font-[var(--font-display)] text-2xl font-semibold text-birthday-blush">
          Dashboard Access
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="admin-username" className="mb-1.5 block text-sm font-medium text-birthday-blush/80">
              Admin username
            </label>
            <input
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-birthday-blush outline-none focus:border-birthday-magenta focus:ring-2 focus:ring-birthday-magenta/40"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-birthday-blush/80">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-birthday-blush outline-none focus:border-birthday-magenta focus:ring-2 focus:ring-birthday-magenta/40"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-birthday-magenta to-birthday-violet px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
