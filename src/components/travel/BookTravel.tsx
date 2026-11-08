"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { getDemoTravel } from "@/lib/demo-travels";
import { createBooking } from "@/lib/travel";
import { syncTripNotification } from "@/lib/trip-notification";

export function BookTravel({ travelId }: { travelId: string }) {
  const travel = getDemoTravel(travelId);
  const { ready, user, activeBooking, refresh, setSession } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(
        `/cont/autentificare/?next=${encodeURIComponent(`/calatorie/rezerva/${travelId}/`)}`,
      );
      return;
    }
    if (activeBooking) {
      router.replace("/calatorie/");
      return;
    }
    setNickname(user.name);
  }, [ready, user, activeBooking, router, travelId]);

  if (!travel) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-stone">Pachetul nu există.</p>
        <Link href="/calatorie/" className="mt-4 inline-block text-pine underline">
          Înapoi
        </Link>
      </div>
    );
  }

  if (!ready || !user || activeBooking) {
    return <p className="py-20 text-center text-stone">Se pregătește rezervarea…</p>;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const booking = await createBooking({
        travelId: travel.id,
        nickname: nickname.trim() || user.name,
      });
      await refresh();
      setSession({ user, activeBooking: booking });
      await syncTripNotification(booking);
      router.push("/calatorie/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Rezervare eșuată");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        Rezervare demo · fără plată
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">
        {travel.title}
      </h1>
      <p className="mt-3 text-stone">{travel.summary}</p>
      <p className="mt-2 text-sm font-semibold text-ink">
        {travel.startsOn} → {travel.endsOn}
        {travel.includesPiticot ? " · include Circuitul Piticotului" : ""}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
            Porecla în Piticot
          </span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
            required
          />
        </label>
        {error ? (
          <p className="text-sm font-semibold text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Se confirmă…" : "Confirmă rezervarea demo"}
        </button>
      </form>
    </div>
  );
}
