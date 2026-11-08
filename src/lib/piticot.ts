export type PiticotStation = {
  id: string;
  title: string;
  /** Title split into short lines for the board label */
  label: string[];
  blurb: string;
  /** 0-based order on the board */
  order: number;
  storySnippet: string;
  /** Board coordinates (BOARD_W × BOARD_H units) */
  x: number;
  y: number;
  accent: string;
};

export type PiticotTrip = {
  code: string;
  name: string;
  tagline: string;
  stations: PiticotStation[];
};

export const PITICOT_DEMO_CODE = "ROHUB-DEMO";

/** Board drawing space — always rendered at this aspect ratio (9:16). */
export const BOARD_W = 360;
export const BOARD_H = 640;

type Pt = { x: number; y: number };

/** Serpentine route: start bottom-left, finish top-right next to the cottage. */
const WAYPOINTS: Pt[] = [
  { x: 52, y: 590 },
  { x: 132, y: 597 },
  { x: 214, y: 590 },
  { x: 288, y: 578 },
  { x: 320, y: 538 },
  { x: 286, y: 494 },
  { x: 202, y: 482 },
  { x: 118, y: 478 },
  { x: 62, y: 462 },
  { x: 42, y: 418 },
  { x: 74, y: 376 },
  { x: 156, y: 366 },
  { x: 240, y: 362 },
  { x: 300, y: 348 },
  { x: 322, y: 302 },
  { x: 290, y: 258 },
  { x: 206, y: 248 },
  { x: 122, y: 246 },
  { x: 64, y: 232 },
  { x: 42, y: 188 },
  { x: 76, y: 144 },
  { x: 150, y: 134 },
  { x: 214, y: 128 },
  { x: 262, y: 116 },
];

function catmullRom(points: Pt[], samplesPerSeg = 24): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < samplesPerSeg; s++) {
      const t = s / samplesPerSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b +
          (-a + c) * t +
          (2 * a - 5 * b + 4 * c - d) * t2 +
          (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

function resample(poly: Pt[], n: number): Pt[] {
  const cum = [0];
  for (let i = 1; i < poly.length; i++) {
    cum.push(
      cum[i - 1] + Math.hypot(poly[i].x - poly[i - 1].x, poly[i].y - poly[i - 1].y),
    );
  }
  const total = cum[cum.length - 1];
  const out: Pt[] = [];
  let seg = 1;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (seg < cum.length - 1 && cum[seg] < target) seg++;
    const span = cum[seg] - cum[seg - 1] || 1;
    const u = (target - cum[seg - 1]) / span;
    out.push({
      x: poly[seg - 1].x + (poly[seg].x - poly[seg - 1].x) * u,
      y: poly[seg - 1].y + (poly[seg].y - poly[seg - 1].y) * u,
    });
  }
  return out;
}

const round = (v: number) => Math.round(v * 10) / 10;

const DENSE = catmullRom(WAYPOINTS);

/** SVG path of the country road under the spaces. */
export const BOARD_ROAD_D = DENSE.map(
  (p, i) => `${i === 0 ? "M" : "L"} ${round(p.x)} ${round(p.y)}`,
).join(" ");

export const SPACE_COUNT = 36;

/** Which board space each station sits on (index into BOARD_SPACES). */
export const STATION_SPACES = [2, 8, 15, 21, 28, 35] as const;

/** Classic Piticot space colours: red, yellow, green, blue. */
export const SPACE_COLORS = ["#c8372d", "#e3a92f", "#4f8a3c", "#3d6fa8"] as const;

export type BoardSpace = {
  i: number;
  x: number;
  y: number;
  stationIndex: number | null;
  color: string;
};

export const BOARD_SPACES: BoardSpace[] = resample(DENSE, SPACE_COUNT).map(
  (p, i) => {
    const stationIndex = (STATION_SPACES as readonly number[]).indexOf(i);
    return {
      i,
      x: round(p.x),
      y: round(p.y),
      stationIndex: stationIndex >= 0 ? stationIndex : null,
      color: SPACE_COLORS[i % SPACE_COLORS.length],
    };
  },
);

/** Station index → board space index (-1 = start space). */
export function spaceForStation(stationIndex: number): number {
  if (stationIndex < 0) return 0;
  return STATION_SPACES[Math.min(stationIndex, STATION_SPACES.length - 1)];
}

const STATION_META = [
  {
    id: "plecare",
    title: "Punct de plecare",
    label: ["Punct de", "plecare"],
    blurb: "Echipa se adună. Piticotul își începe drumul.",
    accent: "#4f8a3c",
    storySnippet:
      "Dimineața a început cu râsete și cafea. Piticotul a fost botezat de grup și a urcat în rucsac.",
  },
  {
    id: "crama",
    title: "Degustare la cramă",
    label: ["Degustare", "la cramă"],
    blurb: "Note de fructe, povești de podgorie, un toast pentru echipă.",
    accent: "#7b2d4a",
    storySnippet:
      "La cramă, paharele s-au ciocnit în ritmul poveștilor locale. Piticotul a căpătat primul „sigiliu” — aroma de stejar și soare.",
  },
  {
    id: "comoara",
    title: "Vânătoare de comori",
    label: ["Vânătoare", "de comori"],
    blurb: "Indicii pe ulițe, râsete pe drum, o comoară comună la final.",
    accent: "#c98a12",
    storySnippet:
      "Harta de hârtie s-a mototolit de emoție. Comoara nu a fost aur — a fost o fotografie de grup și un secret șoptit.",
  },
  {
    id: "casa-scriitorului",
    title: "Casa scriitorului",
    label: ["Casa", "scriitorului"],
    blurb: "Pagini, portrete și o cameră unde timpul încetinește.",
    accent: "#3d6fa8",
    storySnippet:
      "În casa scriitorului, grupul a citit cu voce tare. Piticotul a „semnat” pe o foaie invizibilă: aici am învățat să ascultăm.",
  },
  {
    id: "masa-locala",
    title: "Masă la gazdă locală",
    label: ["Masă la", "gazdă locală"],
    blurb: "Gusturi de casă, povești de la masă, pâine caldă.",
    accent: "#b5532a",
    storySnippet:
      "La masa gazdei, tăcerea a fost doar pentru sarmale. Apoi au venit râsetele — și rețeta pe care nimeni nu a scris-o corect.",
  },
  {
    id: "final",
    title: "Finalul drumului",
    label: ["Finalul", "drumului"],
    blurb: "Ultimul scan. Piticotul ajunge acasă — și povestea se deschide.",
    accent: "#c8372d",
    storySnippet:
      "La final, Piticotul nu a mai fost un joc. A fost martorul unei zile în care echipa a descoperit România împreună.",
  },
] as const;

const startSpace = BOARD_SPACES[0];
export const PITICOT_START = { x: startSpace.x, y: startSpace.y } as const;

export const piticotTrip: PiticotTrip = {
  code: PITICOT_DEMO_CODE,
  name: "Circuitul Piticotului",
  tagline: "Scanează, avansează, spune povestea.",
  stations: STATION_META.map((meta, order) => {
    const space = BOARD_SPACES[STATION_SPACES[order]];
    return {
      ...meta,
      label: [...meta.label],
      order,
      x: space.x,
      y: space.y,
    };
  }),
};

export function getStation(stationId: string): PiticotStation | undefined {
  return piticotTrip.stations.find((s) => s.id === stationId);
}

export function getOrderedStations(): PiticotStation[] {
  return [...piticotTrip.stations].sort((a, b) => a.order - b.order);
}

export function allStationIds(): string[] {
  return piticotTrip.stations.map((s) => s.id);
}
