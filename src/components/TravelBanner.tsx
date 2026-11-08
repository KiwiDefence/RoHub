"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { travelDayIndex } from "@/lib/travel";

/** Slim always-on strip when the user has an active demo travel. */
export function TravelBanner() {
  const { ready, activeBooking } = useAuth();
  const pathname = usePathname() ?? "/";

  if (!ready || !activeBooking?.travel) return null;
  if (pathname.startsWith("/calatorie") || pathname.startsWith("/inovatie/piticot")) {
    return null;
  }

  const day = travelDayIndex(activeBooking) + 1;
  const travel = activeBooking.travel;

  return (
    <>
      <div className="h-11 shrink-0" aria-hidden />
      <div className="fixed inset-x-0 top-14 z-[55] border-b border-pine/20 bg-pine text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-8">
          <p className="min-w-0 text-sm font-medium leading-snug">
            <span className="font-semibold">{travel.title}</span>
            <span className="opacity-80"> · Ziua {day}</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <Link
              href="/calatorie/"
              className="rounded-sm bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-white/25"
            >
              Itinerariu
            </Link>
            {travel.includesPiticot ? (
              <Link
                href="/inovatie/piticot/"
                className="rounded-sm bg-dawn px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink hover:brightness-110"
              >
                Piticot
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
