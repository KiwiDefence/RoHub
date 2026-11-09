"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useAuth } from "@/components/AuthProvider";
import { isNativeApp } from "@/lib/native";
import { travelDayIndex } from "@/lib/travel";

const noopSubscribe = () => () => {};

/**
 * Website-only trip strip. Hidden in the native app — bottom tabs already
 * expose Călătoria / Piticot, and a second fixed bar fights the overlay header.
 */
export function TravelBanner() {
  const native = useSyncExternalStore(noopSubscribe, isNativeApp, () => false);
  const { ready, activeBooking } = useAuth();
  const pathname = usePathname() ?? "/";

  if (native) return null;
  if (!ready || !activeBooking?.travel) return null;
  if (
    pathname.startsWith("/calatorie") ||
    pathname.startsWith("/inovatie/piticot") ||
    pathname.startsWith("/cont")
  ) {
    return null;
  }

  const day = travelDayIndex(activeBooking) + 1;
  const travel = activeBooking.travel;

  return (
    <div className="border-b border-pine/15 bg-pine text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2.5 sm:px-8">
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
  );
}
