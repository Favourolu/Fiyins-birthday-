export type Question = {
  id: number;
  section: string;
  question: string;
  options: string[];
};

export type StatusResponse = {
  completed: boolean;
  answers: Record<number, string>;
  score?: number;
  percentage?: number;
  total: number;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || "Something went wrong.", res.status);
  }
  return data as T;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ ok: true }>("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),
  me: () => request<{ username: string; displayName: string }>("/auth/me"),

  adminLogin: (username: string, password: string) =>
    request<{ ok: true }>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  adminLogout: () => request<{ ok: true }>("/auth/admin/logout", { method: "POST" }),
  adminMe: () => request<{ ok: true }>("/auth/admin/me"),

  getQuestions: () => request<{ questions: Question[]; total: number }>("/test/questions"),
  getStatus: () => request<StatusResponse>("/test/status"),
  lockAnswer: (questionId: number, answer: string) =>
    request<{ ok: true; reaction: string }>("/test/answer", {
      method: "POST",
      body: JSON.stringify({ questionId, answer }),
    }),
  submit: () =>
    request<{ score: number; total: number; percentage: number }>("/test/submit", { method: "POST" }),

  adminReset: (username: string) =>
    request<{ ok: true }>(`/admin/reset/${encodeURIComponent(username)}`, { method: "POST" }),

  getLeaderboard: () =>
    request<{
      leaderboard: Array<{ rank: number; displayName: string; score: number; percentage: number; isYou: boolean }>;
      total: number;
    }>("/leaderboard"),

  adminResults: () =>
    request<{
      results: Array<{
        username: string;
        displayName: string;
        status: string;
        score: number | null;
        percentage: number | null;
        completedAt: string | null;
      }>;
    }>("/admin/results"),
};

export { ApiError };
