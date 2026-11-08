import { Capacitor } from "@capacitor/core";

/** True inside the Android app (Capacitor), false on the website. */
export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  return Capacitor.isNativePlatform();
}
