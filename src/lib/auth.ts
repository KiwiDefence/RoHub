import { apiRequest, getAuthToken, setAuthToken } from "@/lib/api";
import type { BookingWithTravel } from "@/lib/travel";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type AuthSession = {
  user: AuthUser;
  activeBooking: BookingWithTravel | null;
};

export async function registerAccount(input: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthSession> {
  const res = await apiRequest<{ token: string; user: AuthUser }>(
    "/api/auth/register",
    {
      method: "POST",
      auth: false,
      body: JSON.stringify(input),
    },
  );
  setAuthToken(res.token);
  return { user: res.user, activeBooking: null };
}

export async function loginAccount(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const res = await apiRequest<{ token: string; user: AuthUser }>(
    "/api/auth/login",
    {
      method: "POST",
      auth: false,
      body: JSON.stringify(input),
    },
  );
  setAuthToken(res.token);
  const me = await fetchMe();
  return me ?? { user: res.user, activeBooking: null };
}

export async function fetchMe(): Promise<AuthSession | null> {
  if (!getAuthToken()) return null;
  try {
    return await apiRequest<AuthSession>("/api/auth/me");
  } catch {
    setAuthToken(null);
    return null;
  }
}

export async function logoutAccount(): Promise<void> {
  try {
    if (getAuthToken()) {
      await apiRequest("/api/auth/logout", { method: "POST" });
    }
  } catch {
    /* ignore */
  }
  setAuthToken(null);
}
