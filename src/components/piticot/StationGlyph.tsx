const INK = "#3a2a1c";

type StationGlyphProps = {
  id: string;
  muted?: boolean;
};

/** Small hand-drawn icon for a station, centred on 0,0 (≈ ±14 units). */
export function StationGlyph({ id, muted = false }: StationGlyphProps) {
  return (
    <g
      stroke={INK}
      strokeWidth={1.3}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={muted ? 0.45 : 1}
    >
      {renderGlyph(id)}
    </g>
  );
}

function renderGlyph(id: string) {
  switch (id) {
    case "plecare":
      return (
        <>
          <rect x={-1.6} y={-12} width={3.2} height={25} rx={0.8} fill="#8a5a32" />
          <path d="M-10 -10 H7 L11 -6 L7 -2 H-10 Z" fill="#e3a92f" />
          <path d="M10 1 H-7 L-11 5 L-7 9 H10 Z" fill="#c8372d" />
        </>
      );
    case "crama":
      return (
        <>
          <path d="M0 -6 V-12" fill="none" />
          <path d="M1 -9 C 5 -15 12 -13 11 -8 C 8 -6 4 -7 1 -9 Z" fill="#5f8f3e" />
          {[
            [-6, -2],
            [0, -2],
            [6, -2],
            [-3, 4],
            [3, 4],
            [0, 10],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3.6} fill="#6b2c5a" />
          ))}
        </>
      );
    case "comoara":
      return (
        <>
          <rect x={-12} y={-2} width={24} height={13} rx={1.2} fill="#8a5a32" />
          <path d="M-12 -2 V-5 Q0 -15 12 -5 V-2 Z" fill="#a86e3c" />
          <rect x={-2} y={-10} width={4} height={21} fill="#e3a92f" />
          <rect x={-3.2} y={-3.5} width={6.4} height={5.5} rx={1} fill="#f2c14e" />
        </>
      );
    case "casa-scriitorului":
      return (
        <>
          <path d="M0 -6 Q -6 -10 -13 -8 V8 Q -6 6 0 9 Z" fill="#f7efd9" />
          <path d="M0 -6 Q 6 -10 13 -8 V8 Q 6 6 0 9 Z" fill="#f7efd9" />
          <path d="M0 -6 V9" fill="none" />
          <path
            d="M-10 -4 Q-6 -6 -3 -4 M-10 0 Q-6 -2 -3 0 M-10 4 Q-6 2 -3 4 M3 -4 Q6 -6 10 -4 M3 0 Q6 -2 10 0"
            fill="none"
            strokeWidth={0.8}
          />
          <path d="M6 4 L14 -12" fill="none" stroke="#3d6fa8" strokeWidth={1.6} />
        </>
      );
    case "masa-locala":
      return (
        <>
          <path d="M-4 -6 q-3 -4 0 -8 M3 -6 q3 -4 0 -8" fill="none" strokeWidth={1.1} />
          <path d="M-12 -1 H12 Q11 11 0 11 Q-11 11 -12 -1 Z" fill="#b5532a" />
          <ellipse cx={0} cy={-1} rx={12} ry={2.6} fill="#ead3a1" />
          <path d="M-7 5 Q0 7 7 5" fill="none" stroke="#f4ead2" strokeWidth={1} />
        </>
      );
    case "final":
      return (
        <>
          <path d="M-9 13 V-13" fill="none" strokeWidth={1.6} />
          <rect x={-8} y={-12} width={6} height={12} fill="#2d4f9e" stroke="none" />
          <rect x={-2} y={-12} width={6} height={12} fill="#e3b22f" stroke="none" />
          <rect x={4} y={-12} width={6} height={12} fill="#c8372d" stroke="none" />
          <rect x={-8} y={-12} width={18} height={12} fill="none" />
          <path d="M-14 13 Q-9 9 -4 13 Z" fill="#5f8f3e" />
        </>
      );
    default:
      return <circle r={8} fill="#e3a92f" />;
  }
}

/** Standalone icon (HTML), e.g. for HUD progress and the storybook. */
export function StationIcon({
  id,
  size = 32,
  muted = false,
}: StationGlyphProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-16 -16 32 32"
      aria-hidden
      className="block"
    >
      <StationGlyph id={id} muted={muted} />
    </svg>
  );
}
