import { isNativeApp } from "@/lib/native";

export const ANDROID_PACKAGE = "com.rohubtravel.app";

/** True on an Android phone/tablet browser (not inside the Capacitor app). */
export function isAndroidBrowser(): boolean {
  if (typeof navigator === "undefined" || isNativeApp()) return false;
  return /Android/i.test(navigator.userAgent);
}

/**
 * Builds an Android Intent URL that opens our app for this path when the app
 * is installed, and falls back to the same HTTPS page when it is not.
 *
 * Uses the custom `rohub://` scheme (works even before App Links verify) and
 * pins `package=` so Android does not ask which app should open the link.
 */
export function androidIntentUrl(pathname: string, fallbackUrl: string): string {
  const path = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
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
