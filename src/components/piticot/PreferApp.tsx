"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { androidIntentUrl, isAndroidBrowser } from "@/lib/open-in-app";

const TRIED_KEY = "rohub-prefer-app:";

/**
 * On Android browsers: try to hand the QR / deep link to the installed app.
 * If the app is missing, the intent falls back to this same page and we stay
 * on the website. Renders nothing inside the Capacitor app or on desktop.
 */
export function PreferApp() {
  const pathname = usePathname() ?? "/";
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isAndroidBrowser()) return;

    setShowBanner(true);

    const key = TRIED_KEY + pathname;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    // Give the page a tick to paint, then hand off. If the app opens, the
    // browser is backgrounded; if not, browser_fallback_url keeps us here.
    const timer = window.setTimeout(() => {
      window.location.href = androidIntentUrl(pathname, window.location.href);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!showBanner) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-[80] flex justify-center px-4">
      <a
        href={androidIntentUrl(pathname, typeof window !== "undefined" ? window.location.href : "")}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border-2 border-[#3a2a1c] bg-[#f4ead2] px-4 py-2 text-sm font-bold text-[#3a2a1c] shadow-[0_3px_0_#3a2a1c]"
      >
        Deschide în aplicație
      </a>
    </div>
  );
}
