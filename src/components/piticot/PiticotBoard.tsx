"use client";

import { useEffect, useState } from "react";
import { BoardArt, BoardFrame } from "@/components/piticot/BoardArt";
import { PiticotFigure } from "@/components/piticot/PiticotFigure";
import { StationGlyph } from "@/components/piticot/StationGlyph";
import {
  BOARD_H,
  BOARD_SPACES,
  BOARD_W,
  spaceForStation,
  type PiticotStation,
} from "@/lib/piticot";

const INK = "#3a2a1c";
const PAPER = "#f4ead2";
const HOP_MS = 250;
const START_DELAY = 500;
const SPACE_R = 13;
const STATION_R = 19;

type Pose = "idle" | "hop" | "land" | "celebrate";

type PiticotBoardProps = {
  stations: PiticotStation[];
  unlocked: Set<string>;
  restingIndex: number;
  playJump?: { fromIndex: number; toIndex: number } | null;
  onJumpComplete?: () => void;
};

type LabelSpot = { x: number; y: number };

function boxHitsCircle(
  cx: number,
  cy: number,
  w: number,
  h: number,
  px: number,
  py: number,
  r: number,
) {
  const dx = Math.max(Math.abs(px - cx) - w / 2, 0);
  const dy = Math.max(Math.abs(py - cy) - h / 2, 0);
  return dx * dx + dy * dy < r * r;
}

function placeLabel(station: PiticotStation): LabelSpot {
  const longest = Math.max(...station.label.map((l) => l.length));
  const w = longest * 5.4 + 6;
  const h = 28;
  const side = STATION_R + w / 2 + 4;
  const diag = w / 2 + 6;
  const candidates: LabelSpot[] = [
    { x: station.x, y: station.y + 36 },
    { x: station.x + diag, y: station.y + 34 },
    { x: station.x - diag, y: station.y + 34 },
    { x: station.x + side, y: station.y },
    { x: station.x - side, y: station.y },
    { x: station.x, y: station.y - 36 },
    { x: station.x + diag, y: station.y - 34 },
    { x: station.x - diag, y: station.y - 34 },
  ];
  let best = candidates[0];
  let bestHits = Infinity;
  for (const c of candidates) {
    const inside =
      c.x - w / 2 > 18 &&
      c.x + w / 2 < BOARD_W - 18 &&
      c.y - h / 2 > 18 &&
      c.y + h / 2 < BOARD_H - 18;
    if (!inside) continue;
    const hits = BOARD_SPACES.filter(
      (s) =>
        !(s.x === station.x && s.y === station.y) &&
        boxHitsCircle(
          c.x,
          c.y,
          w,
          h,
          s.x,
          s.y,
          s.stationIndex === null ? SPACE_R : STATION_R,
        ),
    ).length;
    if (hits === 0) return c;
    if (hits < bestHits) {
      best = c;
      bestHits = hits;
    }
  }
  return best;
}

export function PiticotBoard({
  stations,
  unlocked,
  restingIndex,
  playJump = null,
  onJumpComplete,
}: PiticotBoardProps) {
  const lastSpace = BOARD_SPACES.length - 1;
  const [animSpace, setSpace] = useState(() =>
    spaceForStation(playJump ? playJump.fromIndex : restingIndex),
  );
  const [animPose, setPose] = useState<Pose>("idle");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [hopKey, setHopKey] = useState(0);
  const [landKey, setLandKey] = useState(0);

  useEffect(() => {
    const jump = playJump;
    if (!jump) return;

    const from = spaceForStation(jump.fromIndex);
    const to = spaceForStation(jump.toIndex);
    const timers: number[] = [];

    const steps = Math.max(0, to - from);
    for (let k = 1; k <= steps; k++) {
      timers.push(
        window.setTimeout(() => {
          const prev = BOARD_SPACES[from + k - 1];
          const next = BOARD_SPACES[from + k];
          if (Math.abs(next.x - prev.x) > 2) setFacing(next.x > prev.x ? 1 : -1);
          setSpace(from + k);
          setHopKey((h) => h + 1);
          setPose("hop");
        }, START_DELAY + (k - 1) * HOP_MS),
      );
    }

    const landAt = START_DELAY + steps * HOP_MS;
    timers.push(
      window.setTimeout(() => {
        setSpace(to);
        setLandKey((l) => l + 1);
        setPose(to === lastSpace ? "celebrate" : "land");
      }, landAt),
    );
    timers.push(
      window.setTimeout(() => {
        if (to !== lastSpace) setPose("idle");
        onJumpComplete?.();
      }, landAt + 650),
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playJump?.fromIndex, playJump?.toIndex]);

  const restSpace = spaceForStation(restingIndex);
  const space = playJump ? animSpace : restSpace;
  const pose: Pose = playJump
    ? animPose
    : restSpace === lastSpace && unlocked.size >= stations.length
      ? "celebrate"
      : "idle";
  const here = BOARD_SPACES[space];
  const hereStation = pose !== "hop" ? here.stationIndex : null;

  return (
    <div className="relative h-full w-full select-none">
      <svg
        viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Tabla de joc Piticot cu traseul circuitului"
      >
        <BoardArt />

        {BOARD_SPACES.map((s) => {
          if (s.stationIndex !== null) return null;
          if (s.i === 0) {
            return (
              <g key={s.i} transform={`translate(${s.x} ${s.y})`}>
                <circle cx={1.2} cy={2} r={17} fill={INK} opacity={0.25} />
                <circle r={17} fill={PAPER} stroke={INK} strokeWidth={1.8} />
                <circle r={13.5} fill="none" stroke="#4f8a3c" strokeWidth={2} />
                <text
                  y={3}
                  textAnchor="middle"
                  fontSize={8}
                  fontWeight={800}
                  letterSpacing={0.4}
                  fill={INK}
                >
                  START
                </text>
              </g>
            );
          }
          const darkText = s.color === "#e3a92f";
          return (
            <g key={s.i} transform={`translate(${s.x} ${s.y})`}>
              <circle cx={1.2} cy={1.8} r={SPACE_R} fill={INK} opacity={0.25} />
              <circle r={SPACE_R} fill={s.color} stroke={INK} strokeWidth={1.6} />
              <text
                y={4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={800}
                fill={darkText ? INK : "#fbf5e6"}
              >
                {s.i}
              </text>
            </g>
          );
        })}

        {stations.map((station, idx) => {
          const open = unlocked.has(station.id);
          const isHere = hereStation === idx;
          const spot = placeLabel(station);
          return (
            <g key={station.id}>
              <g transform={`translate(${station.x} ${station.y})`}>
                {isHere ? (
                  <circle r={STATION_R} fill="none" stroke={station.accent} strokeWidth={3} className="pt-ring" />
                ) : null}
                <circle cx={1.4} cy={2.2} r={STATION_R} fill={INK} opacity={0.28} />
                <circle r={STATION_R} fill={PAPER} stroke={INK} strokeWidth={1.8} />
                <circle
                  r={STATION_R - 3.5}
                  fill={open ? station.accent : "none"}
                  fillOpacity={open ? 0.18 : 0}
                  stroke={open ? station.accent : "#a38f6c"}
                  strokeWidth={open ? 3 : 1.4}
                  strokeDasharray={open ? undefined : "3 3"}
                />
                <g transform="scale(0.82)">
                  <StationGlyph id={station.id} muted={!open} />
                </g>
                {open ? (
                  <g transform={`translate(${STATION_R * 0.72} ${-STATION_R * 0.72})`}>
                    <circle r={5.6} fill="#4f8a3c" stroke={INK} strokeWidth={1.2} />
                    <path d="M-2.6 0.2 L-0.6 2.2 L2.8 -1.8" fill="none" stroke="#fbf5e6" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ) : null}
              </g>
              <text
                x={spot.x}
                y={spot.y - 2}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={open ? INK : "#6b5a40"}
                stroke={PAPER}
                strokeWidth={3.2}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {station.label.map((line, li) => (
                  <tspan key={line} x={spot.x} dy={li === 0 ? 0 : 11.5}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {landKey > 0 && pose !== "hop" ? (
          <g key={landKey} transform={`translate(${here.x} ${here.y})`} className="pt-sparks">
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <path
                  key={i}
                  d={`M${Math.cos(a) * 24} ${Math.sin(a) * 24} L${Math.cos(a) * 32} ${Math.sin(a) * 32}`}
                  stroke={i % 2 ? "#e3a92f" : "#c8372d"}
                  strokeWidth={2.6}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ) : null}

        <BoardFrame />
      </svg>

      <div
        className="pt-mover pointer-events-none absolute z-[2]"
        style={{
          left: `${(here.x / BOARD_W) * 100}%`,
          top: `${(here.y / BOARD_H) * 100}%`,
          width: "15%",
          transform: "translate(-50%, -86%)",
          transitionDuration: `${HOP_MS}ms`,
        }}
      >
        <span className="pt-shadow" aria-hidden key={`s${hopKey}`} data-hop={pose === "hop" ? "1" : "0"} />
        {landKey > 0 && pose !== "hop" ? (
          <span key={`p${landKey}`} className="pt-puffs" aria-hidden>
            <i style={{ ["--dx" as string]: "-120%" }} />
            <i style={{ ["--dx" as string]: "-50%" }} />
            <i style={{ ["--dx" as string]: "50%" }} />
            <i style={{ ["--dx" as string]: "120%" }} />
          </span>
        ) : null}
        <div
          key={`h${hopKey}`}
          className={
            pose === "hop"
              ? "pt-hop"
              : pose === "land"
                ? "pt-land"
                : pose === "celebrate"
                  ? "pt-celebrate"
                  : "pt-idle"
          }
          style={{ aspectRatio: "60 / 90" }}
        >
          <div style={{ transform: `scaleX(${facing})`, height: "100%" }}>
            <PiticotFigure />
          </div>
        </div>
      </div>
    </div>
  );
}
