"use client";

import { useRouter } from "next/navigation";
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
  evaluateScan,
  furthestOrder,
  type ScanGate,
} from "@/lib/piticot-scan-gate";
import {
  loadProgress,
  startTrip,
  unlockStation,
} from "@/lib/piticot-storage";
import { syncProgress } from "@/lib/piticot-sync";

type ScanClientProps = {
  stationId: string;
};

type Phase = "boot" | "jump" | "reveal" | "blocked" | "invalid";

export function ScanClient({ stationId }: ScanClientProps) {
  const router = useRouter();
  const station = getStation(stationId);
  const stations = useMemo(() => getOrderedStations(), []);
  const [phase, setPhase] = useState<Phase>("boot");
  const [gate, setGate] = useState<ScanGate | null>(null);
  const [fromIndex, setFromIndex] = useState(-1);
  const [restingIndex, setRestingIndex] = useState(-1);
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(new Set());
  const scanned = useRef(false);
  const backToBoard = () => router.replace("/inovatie/piticot/");

  useEffect(() => {
    if (scanned.current) return;
    scanned.current = true;
    if (!station) {
      setPhase("invalid");
      return;
    }

    const current =
      loadProgress(PITICOT_DEMO_CODE) ?? startTrip(PITICOT_DEMO_CODE, "Oaspete");
    const verdict = evaluateScan(current, station.id);
    const maxOrder = furthestOrder(current);
    setGate(verdict);
    setUnlockedSet(new Set(current.unlocked));

    if (verdict.kind === "unlock") {
      const next = unlockStation(current, station.id);
      void syncProgress(next);
      setUnlockedSet(new Set(next.unlocked));
      setFromIndex(maxOrder);
      setRestingIndex(station.order);
      setPhase("jump");
      return;
    }

    setRestingIndex(maxOrder);
    setFromIndex(maxOrder);
    setPhase(verdict.kind === "invalid" ? "invalid" : "blocked");
  }, [station]);

  if (phase === "boot") return null;

  if (phase === "invalid" || !station) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="h-28 w-20">
          <PiticotFigure />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold">Codul ăsta nu e pe tablă</h1>
        <p className="mt-2 text-lg italic">Piticotul nu cunoaște oprirea asta.</p>
        <button type="button" onClick={backToBoard} className="pt-btn mt-6 px-6 py-2.5 text-lg">
          Înapoi la joc
        </button>
      </div>
    );
  }

  if (phase === "blocked" && gate && gate.kind !== "unlock") {
    const nextStop = stations.find((s) => s.order === restingIndex + 1);
    return (
      <GameScreen
        hudHeight={168}
        board={
          <PiticotBoard
            stations={stations}
            unlocked={unlockedSet}
            restingIndex={restingIndex}
          />
        }
        hud={
          <div className="pt-rise mx-auto w-full max-w-sm text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b3261e]">
              {station.title}
            </p>
            <h1 className="mt-1 text-[1.75rem] font-extrabold leading-tight">
              {gate.message}
            </h1>
            {gate.kind === "ahead" && nextStop ? (
              <p className="mt-2 text-[1.05rem] italic leading-snug">
                Următoarea oprire e <b>{nextStop.title}</b>.
              </p>
            ) : null}
            <button type="button" onClick={backToBoard} className="pt-btn mt-3 w-full py-2.5 text-lg">
              Înapoi la tablă
            </button>
          </div>
        }
      />
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
          restingIndex={restingIndex}
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
                  Oprire deblocată · {unlockedSet.size} din {stations.length}
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
            <button type="button" onClick={backToBoard} className="pt-btn mt-3 w-full py-2.5 text-lg">
              {complete ? "Deschide povestea" : "Continuă pe tablă"}
            </button>
          </div>
        )
      }
    />
  );
}
