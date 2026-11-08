import type { ReactNode } from "react";
import { Alegreya } from "next/font/google";
import { PiticotLockScroll } from "@/components/piticot/PiticotLockScroll";
import { PreferApp } from "@/components/piticot/PreferApp";

const alegreya = Alegreya({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Immersive game shell — fixed viewport, no site chrome, no page scroll. */
export default function PiticotGameLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`${alegreya.className} fixed inset-0 z-[70] h-[100dvh] w-screen overflow-hidden bg-[#efe2c2] text-[#3a2a1c]`}
    >
      <PiticotLockScroll />
      <PreferApp />
      {children}
    </div>
  );
}
