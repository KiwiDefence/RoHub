"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/components/AuthProvider";
import { FolkStrip } from "@/components/piticot/FolkStrip";
import { GameScreen } from "@/components/piticot/GameScreen";
import { PiticotBoard } from "@/components/piticot/PiticotBoard";
import { PiticotFigure } from "@/components/piticot/PiticotFigure";
import { StationIcon } from "@/components/piticot/StationGlyph";
import {
  PITICOT_DEMO_CODE,
  getOrderedStations,
  piticotTrip,
  type PiticotStation,
} from "@/lib/piticot";
import { isNativeApp } from "@/lib/native";
import { evaluateScan } from "@/lib/piticot-scan-gate";
import { scanStationQr } from "@/lib/piticot-scanner";
import {
  loadProgress,
  resetTrip,
  startTrip,
  type PiticotProgress,
} from "@/lib/piticot-storage";
import {
  forgetPlayer,
  getApiBase,
  pingServer,
  setApiBase,
  syncProgress,
  type SyncStatus,
} from "@/lib/piticot-sync";

type View = "join" | "board" | "storybook" | "need-booking";

const NO_UNLOCKS = new Set<string>();
const noopSubscribe = () => () => {};

export function PiticotApp() {
  const stations = useMemo(() => getOrderedStations(), []);
  const [view, setView] = useState<View>("join");
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState(PITICOT_DEMO_CODE);
  const [nickname, setNickname] = useState("");
  const [progress, setProgress] = useState<PiticotProgress | null>(null);
  const [error, setError] = useState("");
  const [storyIndex, setStoryIndex] = useState(0);
  const [sync, setSync] = useState<SyncStatus>("off");
  const [scanNote, setScanNote] = useState("");
  const [scanning, setScanning] = useState(false);
  const native = useSyncExternalStore(noopSubscribe, isNativeApp, () => false);
  const router = useRouter();
  const { ready: authReady, user, activeBooking } = useAuth();

  useEffect(() => {
    if (!authReady) return;

    const booking = activeBooking;
    const piticotBooking =
      booking?.travel?.includesPiticot && booking.travel.piticotTripCode
        ? booking
        : null;
    const tripCode = piticotBooking?.travel?.piticotTripCode ?? PITICOT_DEMO_CODE;

    const existing = loadProgress(tripCode);
    if (existing) {
      void syncProgress(existing).then(setSync);
      setProgress(existing);
      setNickname(existing.nickname);
      setCode(existing.tripCode);
      setView("board");
      setReady(true);
      return;
    }

    if (piticotBooking) {
      const nick =
        piticotBooking.nickname || user?.name || "Explorator";
      const started = startTrip(tripCode, nick);
      void syncProgress(started).then(setSync);
      setProgress(started);
      setNickname(nick);
      setCode(tripCode);
      setView("board");
      setReady(true);
      return;
    }

    if (user && booking && !booking.travel?.includesPiticot) {
      setView("need-booking");
      setReady(true);
      return;
    }

    if (user && !booking) {
      setView("need-booking");
      setReady(true);
      return;
    }

    // Logged-out demo: keep manual join for organisers / quick test
    setView("join");
    setReady(true);
  }, [authReady, user, activeBooking]);

  const unlockedSet = useMemo(
    () => new Set(progress?.unlocked ?? []),
    [progress],
  );
  const complete = stations.length > 0 && unlockedSet.size >= stations.length;

  const restingIndex = useMemo(() => {
    let max = -1;
    for (const id of progress?.unlocked ?? []) {
      const s = stations.find((st) => st.id === id);
      if (s && s.order > max) max = s.order;
    }
    return max;
  }, [progress, stations]);

  const nextLocked = stations.find((s) => !unlockedSet.has(s.id));
  const storyChapters = stations.filter((s) => unlockedSet.has(s.id));

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const tripCode = code.trim().toUpperCase();
    if (tripCode !== PITICOT_DEMO_CODE) {
      setError(`Codul demo este ${PITICOT_DEMO_CODE}`);
      return;
    }
    if (!nickname.trim()) {
      setError("Scrie o poreclă pentru piticot.");
      return;
    }
    setError("");
    const started = startTrip(tripCode, nickname);
    setProgress(started);
    setView("board");
    void syncProgress(started).then(setSync);
  };

  const handleScan = async () => {
    setScanNote("");
    setScanning(true);
    const result = await scanStationQr();
    setScanning(false);
    if (result.kind === "station") {
      const verdict = evaluateScan(progress, result.stationId);
      if (verdict.kind === "unlock") {
        router.replace(`/inovatie/piticot/scan/${result.stationId}/`);
        return;
      }
      setScanNote(verdict.message);
    } else if (result.kind === "unknown") {
      setScanNote("Codul ăsta nu e de pe traseul Piticotului.");
    } else if (result.kind === "unavailable") {
      setScanNote(result.message);
    }
  };

  const handleReset = () => {
    void forgetPlayer(code || PITICOT_DEMO_CODE);
    resetTrip(code || PITICOT_DEMO_CODE);
    setSync("off");
    setProgress(null);
    setNickname("");
    setStoryIndex(0);
    setView("join");
  };

  if (!ready || !authReady) return null;

  if (view === "need-booking") {
    return (
      <GameScreen
        hudHeight={200}
        board={<PiticotBoard stations={stations} unlocked={NO_UNLOCKS} restingIndex={-1} />}
        hud={
          <div className="pt-rise mx-auto w-full max-w-sm text-center">
            <h1 className="text-[2rem] font-extrabold leading-none text-[#b3261e]">
              Piticot
            </h1>
            <p className="mt-3 text-[1.05rem] leading-snug">
              {activeBooking && !activeBooking.travel?.includesPiticot
                ? "Călătoria ta activă nu include Piticot. Rezervă pachetul Oltenia pentru circuit."
                : "Rezervă o călătorie întâi — apoi Piticotul se deschide automat."}
            </p>
            <Link href="/calatorie/" className="pt-btn mt-5 inline-block w-full py-3 text-lg">
              Călătoria mea
            </Link>
          </div>
        }
      />
    );
  }

  if (view === "storybook" && progress) {
    return (
      <Storybook
        nickname={progress.nickname}
        chapters={storyChapters}
        index={Math.min(storyIndex, Math.max(storyChapters.length - 1, 0))}
        onIndex={setStoryIndex}
        onClose={() => {
          setStoryIndex(0);
          setView("board");
        }}
      />
    );
  }

  if (view === "join") {
    return (
      <GameScreen
        hudHeight={native ? 258 : 232}
        board={<PiticotBoard stations={stations} unlocked={NO_UNLOCKS} restingIndex={-1} />}
        hud={
          <form onSubmit={handleJoin} className="pt-rise mx-auto w-full max-w-sm">
            <div className="text-center">
              <h1 className="text-[2.1rem] font-extrabold leading-none text-[#b3261e]">
                Piticot
              </h1>
              <p className="mt-1 text-[0.95rem] font-medium italic">
                {piticotTrip.name} · scanezi, avansezi, povestești
              </p>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_1.3fr] gap-4">
              <label className="block">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-70">
                  Cod traseu
                </span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="pt-field"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <label className="block">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-70">
                  Porecla ta
                </span>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="ex. Ana"
                  className="pt-field placeholder:font-medium placeholder:text-[#3a2a1c]/35"
                  autoComplete="nickname"
                />
              </label>
            </div>
            <p className="mt-1.5 h-5 text-center text-sm font-bold text-[#b3261e]" role="alert">
              {error}
            </p>
            <button type="submit" className="pt-btn mt-1 w-full py-3 text-lg">
              Pornește la drum
            </button>
            {native ? <ServerLine /> : null}
          </form>
        }
      />
    );
  }

  return (
    <GameScreen
      hudHeight={native ? 218 : 176}
      board={
        <PiticotBoard
          stations={stations}
          unlocked={unlockedSet}
          restingIndex={restingIndex}
        />
      }
      hud={
        <div className="pt-rise mx-auto w-full max-w-sm">
          <div className="flex items-baseline justify-between gap-3">
            <p className="flex min-w-0 items-baseline gap-2 text-lg font-extrabold">
              <span className="truncate">Piticotul lui {progress?.nickname}</span>
              {sync !== "off" ? (
                <span
                  className="shrink-0 text-xs font-bold uppercase tracking-wider"
                  style={{ color: sync === "ok" ? "#4f8a3c" : "#a38f6c" }}
                  title={sync === "ok" ? "Progres trimis organizatorului" : "Server indisponibil, progresul e salvat pe telefon"}
                >
                  ● {sync === "ok" ? "live" : "offline"}
                </span>
              ) : null}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="shrink-0 text-sm font-medium underline decoration-dotted underline-offset-4 opacity-60"
            >
              ia-o de la capăt
            </button>
          </div>

          <StationProgress stations={stations} unlocked={unlockedSet} />

          {complete ? (
            <button
              type="button"
              onClick={() => {
                setStoryIndex(0);
                setView("storybook");
              }}
              className="pt-btn mt-3 w-full py-2.5 text-lg"
            >
              Deschide povestea
            </button>
          ) : nextLocked ? (
            <div className="mt-2.5 text-center">
              <p className="text-[0.95rem] leading-snug">
                Următoarea oprire: <b>{nextLocked.title}</b>. Scanează codul QR de acolo.
              </p>
              {native ? (
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={scanning}
                  className="pt-btn mt-2 w-full py-2.5 text-lg"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
                    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8" />
                  </svg>
                  {scanning ? "Se deschide camera…" : "Scanează codul QR"}
                </button>
              ) : null}
              {scanNote ? (
                <p className="mt-1 text-sm font-bold text-[#b3261e]" role="alert">
                  {scanNote}
                </p>
              ) : null}
              <Link
                href={`/inovatie/piticot/scan/${nextLocked.id}/`}
                className="mt-1 inline-block text-sm italic opacity-55 underline decoration-dotted underline-offset-4"
              >
                (demo) simulează scanarea
              </Link>
            </div>
          ) : null}
        </div>
      }
    />
  );
}

function ServerLine() {
  const [base, setBase] = useState("");
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    const current = getApiBase();
    void pingServer().then((ok) => {
      if (!alive) return;
      setBase(current);
      setOnline(current ? ok : null);
    });
    return () => {
      alive = false;
    };
  }, []);

  const change = async () => {
    const next = window.prompt("Adresa serverului Piticot (ex. 192.168.1.20:4000)", base);
    if (next === null) return;
    setApiBase(next);
    const current = getApiBase();
    setBase(current);
    setOnline(current ? await pingServer() : null);
  };

  const label = base ? base.replace(/^https?:\/\//, "") : "fără server";
  return (
    <p className="mt-2 text-center text-xs opacity-70">
      <span style={{ color: online ? "#4f8a3c" : online === false ? "#b3261e" : undefined }}>
        {"● "}
      </span>
      Server joc: {label}
      {online === false ? " (indisponibil)" : ""} ·{" "}
      <button type="button" onClick={change} className="underline decoration-dotted underline-offset-2">
        schimbă
      </button>
    </p>
  );
}

function StationProgress({
  stations,
  unlocked,
}: {
  stations: PiticotStation[];
  unlocked: Set<string>;
}) {
  return (
    <ol
      className="mt-2 flex items-center justify-between"
      aria-label={`${unlocked.size} din ${stations.length} opriri deblocate`}
    >
      {stations.map((s, i) => {
        const open = unlocked.has(s.id);
        return (
          <li key={s.id} className="flex flex-1 items-center">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-[#f4ead2]"
              style={{
                borderColor: open ? s.accent : "#a38f6c",
                borderStyle: open ? "solid" : "dashed",
              }}
              title={s.title}
            >
              <StationIcon id={s.id} size={26} muted={!open} />
            </span>
            {i < stations.length - 1 ? (
              <span
                className="mx-0.5 h-0.5 flex-1"
                style={{
                  background: open && unlocked.has(stations[i + 1].id) ? "#3a2a1c" : "#3a2a1c33",
                }}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Storybook({
  nickname,
  chapters,
  index,
  onIndex,
  onClose,
}: {
  nickname: string;
  chapters: PiticotStation[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const chapter = chapters[index];
  const isLast = index >= chapters.length - 1;

  return (
    <div className="absolute inset-0 flex flex-col">
      <FolkStrip />
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.16em] opacity-60">
            Povestea lui {nickname}
          </p>
          <button type="button" onClick={onClose} className="text-sm underline decoration-dotted underline-offset-4 opacity-60">
            la tablă
          </button>
        </div>

        {chapter ? (
          <div key={chapter.id} className="pt-rise flex min-h-0 flex-1 flex-col items-center justify-center text-center">
            <p className="text-base italic opacity-70">
              Capitolul {index + 1} din {chapters.length}
            </p>
            <span
              className="mt-3 flex h-24 w-24 items-center justify-center rounded-full border-[3px] bg-[#f4ead2]"
              style={{ borderColor: chapter.accent }}
            >
              <StationIcon id={chapter.id} size={64} />
            </span>
            <h2 className="mt-4 text-[2rem] font-extrabold leading-tight">
              {chapter.title}
            </h2>
            <p className="mt-3 text-[1.2rem] font-medium italic leading-relaxed">
              „{chapter.storySnippet}”
            </p>
            {isLast ? (
              <div className="mt-5 flex items-center gap-3 text-left">
                <div className="h-20 w-14 shrink-0">
                  <PiticotFigure />
                </div>
                <p className="text-[1.05rem] leading-snug">
                  <b>Mulțumim că ați terminat circuitul!</b> Vă vom contacta în
                  următoarele zile pentru mai multe detalii.
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="flex-1 pt-10 text-center italic">Încă nu ai capitole.</p>
        )}

        <div className="flex items-center justify-between gap-4 pt-3">
          <button
            type="button"
            onClick={() => onIndex(index - 1)}
            disabled={index === 0}
            className="text-lg font-bold disabled:opacity-25"
          >
            ‹ înapoi
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {chapters.map((c, i) => (
              <span
                key={c.id}
                className="h-2 w-2 rounded-full"
                style={{ background: i === index ? "#b3261e" : "#3a2a1c40" }}
              />
            ))}
          </div>
          {isLast ? (
            <button type="button" onClick={onClose} className="pt-btn px-5 py-2 text-base">
              Închide
            </button>
          ) : (
            <button type="button" onClick={() => onIndex(index + 1)} className="pt-btn px-5 py-2 text-base">
              mai departe ›
            </button>
          )}
        </div>
      </div>
      <FolkStrip />
    </div>
  );
}
