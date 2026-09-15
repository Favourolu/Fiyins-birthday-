import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";

type AuthState = {
  status: "loading" | "authenticated" | "anonymous";
  username: string | null;
  displayName: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const me = await api.me();
      setUsername(me.username);
      setDisplayName(me.displayName);
      setStatus("authenticated");
    } catch {
      setUsername(null);
      setDisplayName(null);
      setStatus("anonymous");
    }
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setUsername(null);
    setDisplayName(null);
    setStatus("anonymous");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ status, username, displayName, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
