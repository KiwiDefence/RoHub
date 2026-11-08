"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameScreen } from "@/components/piticot/GameScreen";
import { PiticotBoard } from "@/components/piticot/PiticotBoard";
import { PiticotFigure } from "@/components/piticot/PiticotFigure";
import { StationIcon } from "@/components/piticot/StationGlyph";
import {
  PITICOT_DEMO_CODE,
  getOrderedStations,
  getStation,
} from "@/lib/piticot";
import {
  loadProgress,
  startTrip,
  unlockStation,
} from "@/lib/piticot-storage";
import { syncProgress } from "@/lib/piticot-sync";

type ScanClientProps = {
  stationId: string;
};

type Phase = "boot" | "jump" | "reveal" | "invalid";

export function ScanClient({ stationId }: ScanClientProps) {
  const station = getStation(stationId);
  const stations = useMemo(() => getOrderedStations(), []);
  const [phase, setPhase] = useState<Phase>("boot");
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [fromIndex, setFromIndex] = useState(-1);
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(new Set());
  const scanned = useRef(false);

  useEffect(() => {
    if (scanned.current) return;
    scanned.current = true;
    if (!station) {
      setPhase("invalid");
      return;
    }

    const current =
      loadProgress(PITICOT_DEMO_CODE) ?? startTrip(PITICOT_DEMO_CODE, "Oaspete");
    const already = current.unlocked.includes(station.id);
    const prevMax = current.unlocked.reduce((max, id) => {
      const order = stations.find((s) => s.id === id)?.order ?? -1;
      return Math.max(max, order);
    }, -1);

    const next = unlockStation(current, station.id);
    void syncProgress(next);
    setUnlockedSet(new Set(next.unlocked));
    setJustUnlocked(!already);
    setFromIndex(already || prevMax > station.order ? station.order : prevMax);
    setPhase("jump");
  }, [station, stations]);

  if (phase === "boot") return null;

  if (phase === "invalid" || !station) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="h-28 w-20">
          <PiticotFigure />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold">Codul ăsta nu e pe tablă</h1>
        <p className="mt-2 text-lg italic">Piticotul nu cunoaște oprirea asta.</p>
        <Link href="/inovatie/piticot/" className="pt-btn mt-6 px-6 py-2.5 text-lg">
          Înapoi la joc
        </Link>
      </div>
    );
  }

  const complete = unlockedSet.size >= stations.length;

  return (
    <GameScreen
      hudHeight={196}
      board={
        <PiticotBoard
          stations={stations}
          unlocked={unlockedSet}
          restingIndex={station.order}
          playJump={{ fromIndex, toIndex: station.order }}
          onJumpComplete={() => setPhase("reveal")}
        />
      }
      hud={
        phase === "jump" ? (
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#4f8a3c]">
              Cod scanat
            </p>
            <p className="mt-1 text-xl font-bold italic">
              Piticotul pornește spre {station.title.toLowerCase()}…
            </p>
          </div>
        ) : (
          <div key="reveal" className="pt-rise mx-auto w-full max-w-sm">
            <div className="flex items-center gap-3">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] bg-[#f4ead2]"
                style={{ borderColor: station.accent }}
              >
                <StationIcon id={station.id} size={38} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.14em] opacity-65">
                  {justUnlocked ? "Oprire deblocată" : "Ai mai fost aici"} ·{" "}
                  {unlockedSet.size} din {stations.length}
                </p>
                <h1 className="text-[1.6rem] font-extrabold leading-tight">
                  {station.title}
                </h1>
              </div>
            </div>
            <p className="mt-2 text-[1.05rem] italic leading-snug">
              {complete
                ? "Ai strâns toate opririle! Povestea ta te așteaptă pe tablă."
                : station.blurb}
            </p>
            <Link href="/inovatie/piticot/" className="pt-btn mt-3 w-full py-2.5 text-lg">
              {complete ? "Deschide povestea" : "Continuă pe tablă"}
            </Link>
          </div>
        )
      }
    />
  );
}
