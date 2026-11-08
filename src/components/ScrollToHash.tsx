"use client";

import { useEffect } from "react";

/** On first paint / hash change, scroll to the target (static export + Next Link). */
export function ScrollToHash() {
  useEffect(() => {
    function scrollToHash() {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return;
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
