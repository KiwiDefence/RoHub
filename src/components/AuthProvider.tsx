"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchMe,
  loginAccount,
  logoutAccount,
  registerAccount,
  type AuthSession,
  type AuthUser,
} from "@/lib/auth";
import { getApiBase, getAuthToken } from "@/lib/api";
import type { BookingWithTravel } from "@/lib/travel";
import { syncTripNotification } from "@/lib/trip-notification";

type AuthContextValue = {
  ready: boolean;
  user: AuthUser | null;
  activeBooking: BookingWithTravel | null;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (session: AuthSession | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeBooking, setActiveBooking] = useState<BookingWithTravel | null>(
    null,
  );

  const apply = useCallback((session: AuthSession | null) => {
    setUser(session?.user ?? null);
    setActiveBooking(session?.activeBooking ?? null);
    void syncTripNotification(session?.activeBooking ?? null);
  }, []);

  const refresh = useCallback(async () => {
    if (!getApiBase() || !getAuthToken()) {
      apply(null);
      return;
    }
    const session = await fetchMe();
    apply(session);
  }, [apply]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        if (getAuthToken() && getApiBase()) {
          const session = await fetchMe();
          if (alive) apply(session);
        } else if (alive) {
          apply(null);
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [apply]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      activeBooking,
      refresh,
      setSession: apply,
      login: async (email, password) => {
        const session = await loginAccount({ email, password });
        apply(session);
      },
      register: async (name, email, password) => {
        const session = await registerAccount({ name, email, password });
        apply(session);
      },
      logout: async () => {
        await logoutAccount();
        apply(null);
      },
    }),
    [ready, user, activeBooking, refresh, apply],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
