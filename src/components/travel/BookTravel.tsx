"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { getDemoTravel } from "@/lib/demo-travels";
import { isNativeApp } from "@/lib/native";
import { createBooking } from "@/lib/travel";
import {
  requestTripNotificationPermission,
  syncTripNotificationSchedule,
} from "@/lib/trip-notification";

type Step = "details" | "pay" | "done";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateRo(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (!Number.isFinite(d.getTime())) return iso;
  return d.toLocaleDateString("ro-RO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function BookTravel({ travelId }: { travelId: string }) {
  const travel = getDemoTravel(travelId);
  const { ready, user, activeBooking, refresh, setSession } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [nickname, setNickname] = useState("");
  const [guests, setGuests] = useState("2");
  const [startsOn, setStartsOn] = useState(todayIso);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [orderId, setOrderId] = useState("");
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
    if (activeBooking && step !== "done") {
      router.replace("/calatorie/");
      return;
    }
    setNickname(user.name);
    setCardName(user.name);
  }, [ready, user, activeBooking, router, travelId, step]);

  const endsOn = useMemo(() => {
    if (!travel) return startsOn;
    return addDaysIso(startsOn, Math.max(1, travel.days) - 1);
  }, [travel, startsOn]);

  const guestCount = Math.min(20, Math.max(1, Number(guests) || 1));
  const totalRon = (travel?.priceRon ?? 0) * guestCount;

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

  if (!ready || !user || (activeBooking && step !== "done")) {
    return <p className="py-20 text-center text-stone">Se pregătește rezervarea…</p>;
  }

  const goPay = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!startsOn) {
      setError("Alege data de început.");
      return;
    }
    if (travel.includesPiticot && !nickname.trim()) {
      setError("Scrie porecla pentru Piticot.");
      return;
    }
    setStep("pay");
  };

  const payAndBook = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 12) {
      setError("Completează datele cardului.");
      return;
    }
    if (!cardExpiry.trim() || cardCvc.trim().length < 3) {
      setError("Completează expirarea și CVC-ul.");
      return;
    }
    setBusy(true);
    try {
      // Simulated processing delay for the film
      await new Promise((r) => setTimeout(r, 700));
      const booking = await createBooking({
        travelId: travel.id,
        nickname: travel.includesPiticot
          ? nickname.trim() || user.name
          : user.name,
        guests: guestCount,
        startsOn,
      });
      await refresh();
      setSession({ user, activeBooking: booking });
      setOrderId(booking.id.slice(0, 8).toUpperCase());
      setStep("done");
      if (isNativeApp()) {
        await requestTripNotificationPermission();
        await syncTripNotificationSchedule(booking);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Plata a eșuat");
    } finally {
      setBusy(false);
    }
  };

  if (step === "done") {
    return (
      <div className="mx-auto max-w-lg px-5 py-12 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
          Comandă confirmată
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">
          Plata a reușit
        </h1>
        <p className="mt-3 text-stone">
          Ai cumpărat <b className="text-ink">{travel.title}</b>. Cod comandă{" "}
          <b className="text-ink">{orderId}</b> · {totalRon} {travel.currency}.
        </p>
        <p className="mt-2 text-sm text-stone">
          {formatDateRo(startsOn)} → {formatDateRo(endsOn)} · {guestCount}{" "}
          {guestCount === 1 ? "persoană" : "persoane"}
        </p>
        <button
          type="button"
          onClick={() => router.push("/calatorie/")}
          className="mt-8 w-full rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white"
        >
          Deschide Călătoria mea
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-12 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        {step === "details" ? "Pasul 1 · detalii" : "Pasul 2 · plată"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">
        {travel.title}
      </h1>
      <p className="mt-3 text-stone">{travel.summary}</p>
      <p className="mt-2 text-sm font-semibold text-ink">
        {travel.priceRon} {travel.currency} / persoană
      </p>

      {step === "details" ? (
        <form onSubmit={goPay} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
              Data începerii
            </span>
            <input
              type="date"
              value={startsOn}
              onChange={(e) => setStartsOn(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
              required
            />
          </label>
          <p className="text-sm text-stone">
            Se încheie pe <b className="text-ink">{formatDateRo(endsOn)}</b> (
            {travel.days} zile)
          </p>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
              Număr persoane
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
              required
            />
          </label>
          {travel.includesPiticot ? (
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
          ) : null}
          <div className="rounded-sm bg-mist/80 px-4 py-3 text-sm text-ink">
            Total: <b>{totalRon} {travel.currency}</b>
          </div>
          {error ? (
            <p className="text-sm font-semibold text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white"
          >
            Continuă la plată
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => void payAndBook(e)} className="mt-8 space-y-4">
          <div className="rounded-sm border border-stone/15 bg-white px-4 py-3 text-sm text-stone">
            <p>
              {guestCount} × {travel.priceRon} {travel.currency}
            </p>
            <p className="mt-1 font-display text-xl font-bold text-ink">
              {totalRon} {travel.currency}
            </p>
            <p className="mt-1 text-xs">Card de test — nu se încasează bani reali.</p>
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
              Nume pe card
            </span>
            <input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
              autoComplete="cc-name"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
              Număr card
            </span>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
              inputMode="numeric"
              autoComplete="cc-number"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
                Expirare
              </span>
              <input
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/AA"
                className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
                autoComplete="cc-exp"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
                CVC
              </span>
              <input
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="123"
                className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
                inputMode="numeric"
                autoComplete="cc-csc"
                required
              />
            </label>
          </div>
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
            {busy ? "Se procesează…" : `Plătește acum · ${totalRon} ${travel.currency}`}
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setStep("details");
            }}
            className="w-full text-sm text-stone underline decoration-dotted"
          >
            Înapoi la detalii
          </button>
        </form>
      )}
    </div>
  );
}
