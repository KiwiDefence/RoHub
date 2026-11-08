"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { DEMO_TRAVELS } from "@/lib/demo-travels";
import {
  cancelActiveBooking,
  travelDayIndex,
} from "@/lib/travel";
import { syncTripNotification } from "@/lib/trip-notification";

export function TravelHub() {
  const { ready, user, activeBooking, refresh, logout } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/cont/autentificare/?next=/calatorie/");
      return;
    }
    void syncTripNotification(activeBooking);
  }, [ready, user, activeBooking, router]);

  if (!ready || !user) {
    return (
      <p className="py-20 text-center text-stone">Se încarcă călătoria…</p>
    );
  }

  if (!activeBooking?.travel) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <h1 className="font-display text-3xl font-extrabold text-ink">
          Călătoria mea
        </h1>
        <p className="mt-3 text-base text-stone">
          Nu ai o rezervare activă. Alege un pachet demo — fără plată — și
          ajungi la itinerariu + Piticot.
        </p>
        <ul className="mt-8 space-y-4">
          {DEMO_TRAVELS.map((t) => (
            <li key={t.id} className="border border-stone/15 bg-white p-5">
              <h2 className="font-display text-xl font-bold text-ink">{t.title}</h2>
              <p className="mt-2 text-sm text-stone">{t.summary}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-pine">
                {t.startsOn} → {t.endsOn}
                {t.includesPiticot ? " · include Piticot" : ""}
              </p>
              <Link
                href={`/calatorie/rezerva/${t.id}/`}
                className="mt-4 inline-block rounded-sm bg-pine px-4 py-2.5 text-sm font-semibold text-white"
              >
                Rezervă demo
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => void logout().then(() => router.push("/"))}
          className="mt-8 text-sm text-stone underline decoration-dotted"
        >
          Ieși din cont ({user.email})
        </button>
      </div>
    );
  }

  const travel = activeBooking.travel;
  const dayIdx = travelDayIndex(activeBooking);
  const day = travel.itinerary[dayIdx];

  const cancel = async () => {
    if (!confirm("Anulezi rezervarea demo?")) return;
    try {
      await cancelActiveBooking();
      await refresh();
      setNote("Rezervarea a fost anulată.");
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : "Nu am putut anula.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        Călătorie activă · demo
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
        {travel.title}
      </h1>
      <p className="mt-2 text-base text-stone">
        {activeBooking.startsOn} → {activeBooking.endsOn} · Piticot:{" "}
        <b>{activeBooking.nickname}</b>
      </p>

      <div className="mt-6 border-l-4 border-dawn bg-white px-5 py-4">
        <p className="text-sm font-bold uppercase tracking-wide text-stone">
          Astăzi · Ziua {dayIdx + 1}
        </p>
        <h2 className="mt-1 font-display text-xl font-bold text-ink">
          {day?.title ?? `Ziua ${dayIdx + 1}`}
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-stone">
          {(day?.items ?? []).map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-ink">Info rapidă</h2>
        <dl className="mt-3 space-y-3 text-sm text-stone">
          <div>
            <dt className="font-semibold text-ink">Punct de întâlnire</dt>
            <dd>{travel.meetingPoint}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Contact</dt>
            <dd>{travel.hostContact}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-ink">Itinerariu complet</h2>
        <ol className="mt-3 space-y-5">
          {travel.itinerary.map((d, i) => (
            <li
              key={d.title}
              className={i === dayIdx ? "rounded-sm bg-mist/80 p-4" : "px-1"}
            >
              <p className="font-semibold text-ink">{d.title}</p>
              <ul className="mt-2 space-y-1 text-sm text-stone">
                {d.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-ink">Sfaturi</h2>
        <ul className="mt-2 space-y-2 text-sm text-stone">
          {travel.tips.map((tip) => (
            <li key={tip}>· {tip}</li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {travel.includesPiticot ? (
          <Link
            href="/inovatie/piticot/"
            className="inline-flex flex-1 items-center justify-center rounded-sm bg-pine px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Deschide Piticot
          </Link>
        ) : null}
        <Link
          href={`/vacante/${travel.regionSlug}/`}
          className="inline-flex flex-1 items-center justify-center rounded-sm border border-stone/25 bg-white px-5 py-3 text-center text-sm font-semibold text-ink"
        >
          Detalii regiune
        </Link>
      </div>

      {note ? <p className="mt-4 text-sm text-stone">{note}</p> : null}

      <div className="mt-8 flex flex-wrap gap-4 text-sm text-stone">
        <button type="button" onClick={() => void cancel()} className="underline decoration-dotted">
          Anulează rezervarea demo
        </button>
        <button
          type="button"
          onClick={() => void logout().then(() => router.push("/"))}
          className="underline decoration-dotted"
        >
          Ieși din cont
        </button>
      </div>
    </div>
  );
}
