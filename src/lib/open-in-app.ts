import { isNativeApp } from "@/lib/native";

export const ANDROID_PACKAGE = "com.rohubtravel.app";

/** True on an Android phone/tablet browser (not inside the Capacitor app). */
export function isAndroidBrowser(): boolean {
  if (typeof navigator === "undefined" || isNativeApp()) return false;
  return /Android/i.test(navigator.userAgent);
}

/**
 * Builds an Android Intent URL that opens our app for `appPathname` when the
 * app is installed. If it is not, Android follows `fallbackUrl` (usually the
 * website scan page).
 *
 * Uses the custom `rohub://` scheme (works even before App Links verify) and
 * pins `package=` so Android does not ask which app should open the link.
 */
export function androidIntentUrl(appPathname: string, fallbackUrl: string): string {
  const path = appPathname.replace(/^\/+/, "").replace(/\/+$/, "");
  // NativeShell maps rohub://piticot/... → /inovatie/piticot/...
  const hostAndPath = path.startsWith("inovatie/")
    ? path.slice("inovatie/".length)
    : path;
  return (
    `intent://${hostAndPath}/#Intent;` +
    `scheme=rohub;` +
    `package=${ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};` +
    `end`
  );
}

/** Website path for a station scan (after the app-check bridge). */
export function piticotScanPath(stationId: string): string {
  return `/inovatie/piticot/scan/${stationId}/`;
}

/** QR / App Link path that checks for the app first. */
export function piticotGoPath(stationId: string): string {
  return `/inovatie/piticot/go/${stationId}/`;
}

/** Rewrites /go/ deep links to the in-app /scan/ route. */
export function normalizePiticotDeepLink(pathname: string): string {
  const match = pathname.match(/^\/inovatie\/piticot\/go\/([\w-]+)\/?$/);
  if (match) return piticotScanPath(match[1]);
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}
