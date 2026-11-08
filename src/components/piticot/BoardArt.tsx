import { BOARD_H, BOARD_ROAD_D, BOARD_W } from "@/lib/piticot";

const INK = "#3a2a1c";
const MEADOW = "#b9cf86";
const BAND = 14;

/** Static painted board: paper, landscape, scenery, road and folk border. */
export function BoardArt() {
  return (
    <>
      <defs>
        <pattern id="pt-folk" width="16" height="14" patternUnits="userSpaceOnUse">
          <rect width="16" height="14" fill="#b3261e" />
          <path d="M8 1.5 L14 7 L8 12.5 L2 7 Z" fill="#f4ead2" />
          <path d="M8 4.6 L10.4 7 L8 9.4 L5.6 7 Z" fill="#1f1a17" />
          <path d="M0 4.5 L2.5 7 L0 9.5 Z M16 4.5 L13.5 7 L16 9.5 Z" fill="#1f1a17" />
        </pattern>
        <filter id="pt-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.23  0 0 0 0 0.16  0 0 0 0 0.1  0.7 0 0 0 -0.28"
          />
        </filter>
        <radialGradient id="pt-age" cx="50%" cy="50%" r="70%">
          <stop offset="65%" stopColor="#7a5a2e" stopOpacity="0" />
          <stop offset="100%" stopColor="#7a5a2e" stopOpacity="0.22" />
        </radialGradient>
      </defs>

      {/* meadow + sky */}
      <rect width={BOARD_W} height={BOARD_H} fill={MEADOW} />
      <rect x={0} y={0} width={BOARD_W} height={104} fill="#dbe7d6" />
      <Sun x={58} y={52} />
      <Cloud x={98} y={42} />
      <Cloud x={232} y={32} scale={0.8} />
      <Birds x={170} y={52} />
      <path
        d="M0 98 C 40 78, 80 80, 118 92 C 160 74, 210 72, 250 90 C 290 78, 330 80, 360 92 V112 H0 Z"
        fill="#a6c174"
        stroke={INK}
        strokeWidth={1.2}
      />
      <path d="M0 106 C 90 98, 260 98, 360 106 V112 H0 Z" fill={MEADOW} />
      <WoodenChurch x={150} y={98} />

      {/* water */}
      <River />
      <Pond />

      {/* scenery between the rows */}
      <Vineyard />
      <Well x={204} y={326} />
      <Fir x={36} y={312} />
      <Fir x={62} y={322} scale={0.85} />
      <Fir x={94} y={316} scale={1.05} />
      <Fir x={124} y={326} scale={0.8} />
      <Sheep x={226} y={202} />
      <Sheep x={268} y={192} flip />
      <Sheep x={300} y={212} scale={0.85} />
      <Haystack x={134} y={204} />
      <Haystack x={162} y={210} scale={0.8} />
      <Tree x={334} y={196} scale={0.85} />
      <Tree x={32} y={490} scale={0.8} />
      <Tree x={326} y={604} scale={0.9} />
      <Tree x={333} y={456} scale={0.7} />
      <Flowers />

      {/* road */}
      <path d={BOARD_ROAD_D} fill="none" stroke={INK} strokeWidth={31} strokeLinecap="round" strokeLinejoin="round" />
      <path d={BOARD_ROAD_D} fill="none" stroke="#e9d6a4" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={BOARD_ROAD_D}
        fill="none"
        stroke="#d4bb82"
        strokeWidth={1}
        strokeDasharray="1 7"
        strokeLinecap="round"
        transform="translate(0 7)"
      />

      <Cottage x={314} y={96} />
    </>
  );
}

/** Paper grain, aged edges and the folk border, drawn on top of everything. */
export function BoardFrame() {
  const inner = `M${BAND} ${BAND} V${BOARD_H - BAND} H${BOARD_W - BAND} V${BAND} Z`;
  const outer = `M0 0 H${BOARD_W} V${BOARD_H} H0 Z`;
  return (
    <g pointerEvents="none">
      <rect width={BOARD_W} height={BOARD_H} filter="url(#pt-grain)" opacity={0.32} />
      <rect width={BOARD_W} height={BOARD_H} fill="url(#pt-age)" />
      <path d={`${outer} ${inner}`} fill="url(#pt-folk)" fillRule="evenodd" />
      <rect x={BAND + 0.75} y={BAND + 0.75} width={BOARD_W - BAND * 2 - 1.5} height={BOARD_H - BAND * 2 - 1.5} fill="none" stroke={INK} strokeWidth={1.5} />
      <rect x={0.75} y={0.75} width={BOARD_W - 1.5} height={BOARD_H - 1.5} fill="none" stroke={INK} strokeWidth={1.5} />
      {[
        [0, 0],
        [BOARD_W - BAND, 0],
        [0, BOARD_H - BAND],
        [BOARD_W - BAND, BOARD_H - BAND],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <rect width={BAND} height={BAND} fill="#f4ead2" stroke={INK} strokeWidth={1} />
          <path d="M7 2 L9 7 L7 12 L5 7 Z M2 7 L7 5 L12 7 L7 9 Z" fill="#b3261e" />
        </g>
      ))}
    </g>
  );
}

function Sun({ x, y }: { x: number; y: number }) {
  const rays = Array.from({ length: 10 }, (_, i) => (i * Math.PI * 2) / 10);
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={1.2} strokeLinecap="round">
      {rays.map((a) => (
        <path
          key={a}
          d={`M${Math.cos(a) * 19} ${Math.sin(a) * 19} L${Math.cos(a) * 25} ${Math.sin(a) * 25}`}
          stroke="#d99a2b"
          strokeWidth={2.4}
        />
      ))}
      <circle r={15} fill="#f2c14e" />
      <path d="M-6 3 Q0 8 6 3" fill="none" strokeWidth={1} />
      <circle cx={-5} cy={-3} r={1.2} fill={INK} stroke="none" />
      <circle cx={5} cy={-3} r={1.2} fill={INK} stroke="none" />
    </g>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M-22 6 C -28 6 -28 -2 -21 -2 C -20 -10 -9 -12 -5 -6 C -1 -14 13 -13 14 -4 C 22 -5 25 6 17 6 Z"
      fill="#f7f1e1"
      stroke={INK}
      strokeWidth={1.1}
    />
  );
}

function Birds({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={INK} strokeWidth={1.1} strokeLinecap="round">
      <path d="M0 0 q3 -3 6 0 q3 -3 6 0" />
      <path d="M16 -9 q2.5 -2.5 5 0 q2.5 -2.5 5 0" />
      <path d="M30 2 q2 -2 4 0 q2 -2 4 0" />
    </g>
  );
}

function WoodenChurch({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={1} strokeLinejoin="round">
      <rect x={-9} y={-12} width={18} height={12} fill="#8a5a32" />
      <path d="M-13 -11 L0 -22 L13 -11 Z" fill="#4a3424" />
      <rect x={-3} y={-30} width={6} height={9} fill="#8a5a32" />
      <path d="M-4.5 -29 L0 -52 L4.5 -29 Z" fill="#4a3424" />
      <path d="M0 -52 V-59 M-2.5 -56.5 H2.5" fill="none" strokeWidth={1.1} />
      <rect x={-2} y={-7} width={4} height={7} fill="#3a2a1c" />
    </g>
  );
}

function Cottage({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round">
      <path d="M8 -36 q-4 -5 0 -10 q4 -5 0 -10" fill="none" strokeWidth={1.1} opacity={0.7} />
      <rect x={4} y={-34} width={7} height={12} fill="#a86e3c" />
      <rect x={-24} y={-14} width={48} height={28} fill="#f4ecd9" />
      <path d="M-24 4 H24" fill="none" stroke="#3d6fa8" strokeWidth={2.4} />
      <path d="M-30 -12 L-17 -32 L17 -32 L30 -12 Z" fill="#a8432c" />
      <path d="M-22 -18 H22 M-18 -24 H18" fill="none" strokeWidth={0.7} opacity={0.5} />
      <rect x={-5} y={-3} width={10} height={17} fill="#7a5230" />
      <rect x={-19} y={-8} width={9} height={9} fill="#7fb0c4" />
      <path d="M-14.5 -8 V1 M-19 -3.5 H-10" fill="none" strokeWidth={0.9} />
      <rect x={10} y={-8} width={9} height={9} fill="#7fb0c4" />
      <path d="M14.5 -8 V1 M10 -3.5 H19" fill="none" strokeWidth={0.9} />
      <path d="M-30 14 H30" fill="none" />
    </g>
  );
}

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={INK} strokeWidth={1.3} strokeLinejoin="round">
      <path d="M-3 4 L-2 16 L2 16 L3 4 Z" fill="#7a5230" />
      <path
        d="M-12 4 C -19 2 -18 -8 -11 -9 C -11 -18 0 -21 4 -15 C 10 -19 19 -12 15 -5 C 21 -1 17 7 10 6 C 6 10 -8 10 -12 4 Z"
        fill="#6f9c4a"
      />
      <path d="M-6 -10 C -4 -14 1 -15 3 -12" fill="none" stroke="#9cc06e" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Fir({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={INK} strokeWidth={1.3} strokeLinejoin="round">
      <rect x={-2} y={8} width={4} height={8} fill="#7a5230" />
      <path
        d="M0 -24 L8 -12 L4 -12 L11 -2 L6 -2 L13 9 L-13 9 L-6 -2 L-11 -2 L-4 -12 L-8 -12 Z"
        fill="#3f6f45"
      />
    </g>
  );
}

function Sheep({ x, y, scale = 1, flip = false }: { x: number; y: number; scale?: number; flip?: boolean }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      stroke={INK}
      strokeWidth={1.2}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M-6 4 V10 M-1 5 V10 M4 5 V10 M8 4 V10" fill="none" strokeWidth={1.6} />
      <path
        d="M-10 2 C -14 0 -12 -6 -8 -6 C -7 -10 -1 -11 1 -8 C 4 -11 10 -9 10 -5 C 14 -4 13 3 9 4 C 6 7 -7 7 -10 2 Z"
        fill="#f8f4ea"
      />
      <ellipse cx={12} cy={-4} rx={3.6} ry={2.8} fill="#2b1d14" />
    </g>
  );
}

function Haystack({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 -14 V-22" fill="none" stroke="#6b4423" strokeWidth={1.6} />
      <path d="M-12 9 Q-13 -5 0 -15 Q13 -5 12 9 Z" fill="#d9b25a" />
      <path d="M-6 -3 L-3 3 M2 -8 L4 -2 M5 2 L8 7 M-8 5 L-6 8" fill="none" strokeWidth={0.8} opacity={0.6} />
    </g>
  );
}

function Well({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-14 10 V-32 M-17 -36 L-14 -30 L-11 -36" fill="none" stroke="#6b4423" strokeWidth={2.2} />
      <path d="M-40 -16 L34 -50" fill="none" stroke="#7a5230" strokeWidth={2} />
      <ellipse cx={-38} cy={-15} rx={5} ry={4} fill="#9a9184" />
      <path d="M33 -49 V-16" fill="none" strokeWidth={0.9} />
      <rect x={29.5} y={-17} width={7} height={6} rx={1} fill="#8a5a32" />
      <rect x={20} y={-8} width={26} height={16} fill="#b08a5a" />
      <path d="M20 -1 H46 M28 -8 V8 M37 -8 V8" fill="none" strokeWidth={0.8} opacity={0.6} />
    </g>
  );
}

function Vineyard() {
  const rows = [404, 422, 440];
  const stakes = Array.from({ length: 9 }, (_, i) => 168 + i * 19);
  return (
    <g stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      {rows.map((ry, r) => (
        <g key={ry}>
          <path d={`M${160 + r * 4} ${ry + 6} H${330 - r * 2}`} fill="none" strokeWidth={0.9} stroke="#8a6a3c" />
          {stakes.map((sx, i) => {
            const x = sx + (r % 2) * 9;
            if (x > 326) return null;
            return (
              <g key={sx} transform={`translate(${x} ${ry})`}>
                <path d="M0 6 V-6" fill="none" stroke="#6b4423" strokeWidth={1.2} />
                <path
                  d="M-6 0 C -8 -6 -2 -9 0 -6 C 2 -9 8 -6 6 0 C 4 4 -4 4 -6 0 Z"
                  fill={i % 2 ? "#5f8f3e" : "#6f9c4a"}
                  strokeWidth={0.9}
                />
                {i % 3 === 0 ? (
                  <g fill="#6b2c5a" strokeWidth={0.6}>
                    <circle cx={3} cy={3} r={1.8} />
                    <circle cx={5.5} cy={4.5} r={1.6} />
                    <circle cx={3.8} cy={6.2} r={1.5} />
                  </g>
                ) : null}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

function River() {
  const d = "M0 532 C 30 520, 52 548, 84 536 C 98 531, 104 534, 112 536";
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={INK} strokeWidth={13} />
      <path d={d} stroke="#7fb0c4" strokeWidth={10.4} />
      <path d="M22 530 q6 -2 10 0 M56 540 q6 -2 10 0" stroke="#e6f0ee" strokeWidth={1.1} />
    </g>
  );
}

function Pond() {
  return (
    <g stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M104 536 C 104 518, 150 512, 186 514 C 226 516, 252 524, 248 540 C 244 556, 200 560, 160 558 C 124 556, 104 550, 104 536 Z"
        fill="#7fb0c4"
        strokeWidth={1.4}
      />
      <path d="M140 528 q8 -3 16 0 M190 542 q8 -3 16 0 M214 526 q6 -2 12 0" fill="none" stroke="#e6f0ee" strokeWidth={1.2} />
      <g fill="none" strokeWidth={1.1}>
        <path d="M244 534 q-2 -10 1 -16 M248 538 q1 -9 5 -13 M240 540 q-5 -8 -4 -14" stroke="#4f7a3a" />
      </g>
      <ellipse cx={245.5} cy={518} rx={1.6} ry={3.4} fill="#7a5230" strokeWidth={0.7} />
      <ellipse cx={253} cy={524.5} rx={1.6} ry={3.4} fill="#7a5230" strokeWidth={0.7} transform="rotate(25 253 524.5)" />
      <g transform="translate(172 540)">
        <path d="M-7 0 Q-8 -6 0 -5 Q4 -10 8 -6 Q9 -3 6 -2 Q8 3 0 3 Q-6 3 -7 0 Z" fill="#f8f4ea" strokeWidth={1} />
        <path d="M8 -6.5 L11 -6 L8 -4.8" fill="#e3a92f" strokeWidth={0.8} />
        <circle cx={5.5} cy={-6.5} r={0.8} fill={INK} stroke="none" />
      </g>
    </g>
  );
}

function Flowers() {
  const spots: [number, number, string][] = [
    [30, 618, "#c8372d"],
    [74, 622, "#f7f1e1"],
    [120, 619, "#e3a92f"],
    [178, 623, "#c8372d"],
    [226, 620, "#f7f1e1"],
    [274, 622, "#3d6fa8"],
    [300, 452, "#c8372d"],
    [118, 448, "#f7f1e1"],
    [262, 312, "#e3a92f"],
    [150, 300, "#c8372d"],
    [96, 196, "#f7f1e1"],
    [188, 218, "#c8372d"],
  ];
  return (
    <g stroke={INK} strokeWidth={0.7}>
      {spots.map(([x, y, c]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <path d="M0 2 V7" fill="none" stroke="#4f7a3a" strokeWidth={1} />
          <circle r={2.6} fill={c} />
          <circle r={0.9} fill="#e3a92f" stroke="none" />
        </g>
      ))}
    </g>
  );
}
