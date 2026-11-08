"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { androidIntentUrl, isAndroidBrowser } from "@/lib/open-in-app";
import { getStation } from "@/lib/piticot";

type OpenBridgeProps = {
  stationId: string;
};

/**
 * First stop for printed QR codes: try the Android app, then fall back to the
 * website scan page. PreferApp on the scan page remains as a second chance.
 */
export function OpenBridge({ stationId }: OpenBridgeProps) {
  const station = getStation(stationId);
  const webPath = `/inovatie/piticot/scan/${stationId}/`;
  const appPath = webPath;
  const [status, setStatus] = useState<"checking" | "web">("checking");

  useEffect(() => {
    const webUrl = new URL(webPath, window.location.origin).href;

    if (!isAndroidBrowser()) {
      window.location.replace(webUrl);
      return;
    }

    // Hand off to the app. If it is not installed, Android follows
    // browser_fallback_url straight to the website scan page.
    window.location.href = androidIntentUrl(appPath, webUrl);

    // Safety net for browsers that ignore browser_fallback_url.
    const timer = window.setTimeout(() => {
      setStatus("web");
      window.location.replace(webUrl);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [appPath, webPath]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.16em] opacity-60">
        RoHub Travel
      </p>
      <h1 className="mt-3 text-3xl font-extrabold">
        {status === "checking" ? "Se caută aplicația…" : "Deschidem pe site…"}
      </h1>
      <p className="mt-3 max-w-sm text-lg italic opacity-80">
        {station
          ? `Oprirea „${station.title}” se deschide în aplicație dacă e instalată, altfel pe site.`
          : "Te ducem la Circuitul Piticotului."}
      </p>
      <Link
        href={webPath}
        className="pt-btn mt-8 px-6 py-2.5 text-base"
        onClick={() => setStatus("web")}
      >
        Continuă pe site
      </Link>
    </div>
  );
}
