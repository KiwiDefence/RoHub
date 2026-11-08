"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { isNativeApp } from "@/lib/native";
import { normalizePiticotDeepLink } from "@/lib/open-in-app";

const noopSubscribe = () => () => {};

/** Maps an opened URL (https QR link or rohub:// link) to an in-app route. */
function routeFromUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    const path =
      url.protocol === "rohub:"
        ? `/inovatie/${url.host}${url.pathname}`
        : url.pathname;
    if (!path || path === "/") return null;
    return normalizePiticotDeepLink(path);
  } catch {
    return null;
  }
}

type Tab = { href: string; label: string; match: (p: string) => boolean; icon: ReactNode };

const TABS: Tab[] = [
  {
    href: "/",
    label: "Acasă",
    match: (p) => p === "/",
    icon: <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />,
  },
  {
    href: "/vacante/",
    label: "Vacanțe",
    match: (p) => p.startsWith("/vacante"),
    icon: <path d="M3 20h18M6 20l5-9 3 5 2-3 4 7M15 6a2 2 0 1 0 0-.01" />,
  },
  {
    href: "/inovatie/piticot/",
    label: "Piticot",
    match: (p) => p.startsWith("/inovatie/piticot"),
    icon: <path d="M8 20h8l-1.5-8.5Q12 4 15 3q-5 0-6.5 8.5zM12 14v6" />,
  },
  {
    href: "/inovatie/mystery-box/",
    label: "Mystery Box",
    match: (p) => p.startsWith("/inovatie/mystery-box"),
    icon: <path d="M4 9h16v11H4zM3 6h18v3H3zM12 6v14M12 6c-2-4-6-3-5 0M12 6c2-4 6-3 5 0" />,
  },
];

/** App-only chrome: back button, deep links and a bottom tab bar. Renders nothing on the website. */
export function NativeShell() {
  const native = useSyncExternalStore(noopSubscribe, isNativeApp, () => false);
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  useEffect(() => {
    if (!native) return;
    document.documentElement.classList.add("native-app");
    let disposed = false;
    const handles: { remove: () => Promise<void> }[] = [];

    void (async () => {
      const [{ App }, { SplashScreen }] = await Promise.all([
        import("@capacitor/app"),
        import("@capacitor/splash-screen"),
      ]);
      if (disposed) return;
      const open = (url: string) => {
        const route = routeFromUrl(url);
        if (route) router.push(route);
      };
      handles.push(
        await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) window.history.back();
          else void App.exitApp();
        }),
        await App.addListener("appUrlOpen", ({ url }) => open(url)),
      );
      const launch = await App.getLaunchUrl();
      if (launch?.url) open(launch.url);
      void SplashScreen.hide();
    })();

    return () => {
      disposed = true;
      handles.forEach((h) => void h.remove());
    };
  }, [native, router]);

  if (!native || pathname.startsWith("/inovatie/piticot")) return null;

  return (
    <nav
      aria-label="Navigare aplicație"
      className="fixed inset-x-0 bottom-0 z-[65] border-t border-ink/10 bg-white/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
                  active ? "text-pine" : "text-stone"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2.2 : 1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {tab.icon}
                </svg>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
