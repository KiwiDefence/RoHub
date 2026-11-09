"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export function AccountHome() {
  const { ready, user, activeBooking, logout } = useAuth();
  const router = useRouter();

  if (!ready) {
    return <p className="py-20 text-center text-stone">Se încarcă contul…</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center sm:px-8">
        <h1 className="font-display text-3xl font-extrabold text-ink">Contul tău</h1>
        <p className="mt-3 text-stone">
          Creează un cont ca să rezervi o călătorie și să deblochezi Piticot.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/cont/inregistrare/?next=/calatorie/"
            className="rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white"
          >
            Înregistrează-te
          </Link>
          <Link
            href="/cont/autentificare/?next=/calatorie/"
            className="rounded-sm border border-stone/25 bg-white px-5 py-3 text-sm font-semibold text-ink"
          >
            Autentifică-te
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">Salut, {user.name}</h1>
      <p className="mt-2 text-stone">{user.email}</p>

      {activeBooking?.travel ? (
        <div className="mt-8 border border-pine/20 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-pine">
            Călătoria ta
          </p>
          <p className="mt-2 font-display text-xl font-bold text-ink">
            {activeBooking.travel.title}
          </p>
          <p className="mt-2 text-sm text-stone">
            Itinerariul zilei
            {activeBooking.travel.includesPiticot
              ? " și jocul Piticot"
              : ""}{" "}
            sunt în Călătoria mea.
          </p>
          <Link
            href="/calatorie/"
            className="mt-4 inline-flex rounded-sm bg-pine px-4 py-2.5 text-sm font-semibold text-white"
          >
            Deschide Călătoria mea
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-sm text-stone">
            Nu ai o călătorie activă încă.
          </p>
          <Link
            href="/calatorie/"
            className="mt-4 inline-flex rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white"
          >
            Alege o călătorie
          </Link>
        </div>
      )}

      <button
        type="button"
        className="mt-10 text-sm text-stone underline decoration-dotted"
        onClick={() => void logout().then(() => router.push("/"))}
      >
        Ieși din cont
      </button>
    </div>
  );
}
