const INK = "#3a2a1c";

/** The Piticot: red pointed hat, white beard, blue coat, walking stick. */
export function PiticotFigure({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 90"
      className={`block h-full w-full overflow-visible ${className}`}
      aria-hidden
    >
      <g stroke={INK} strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round">
        {/* walking stick */}
        <path d="M49 50 L53 87" fill="none" stroke="#6b4423" strokeWidth={2.6} />
        <path d="M49 50 L53 87" fill="none" strokeWidth={0.6} opacity={0.5} />

        {/* boots */}
        <path d="M14 86 Q14 79 20 79 L26 79 Q28 86 26 87 L15 87 Q14 87 14 86 Z" fill="#2b1d14" />
        <path d="M34 79 L40 79 Q46 79 46 86 Q46 87 45 87 L34 87 Q32 86 34 79 Z" fill="#2b1d14" />

        {/* trousers */}
        <path d="M18 66 L19 80 L27 80 L29 70 L31 70 L33 80 L41 80 L42 66 Z" fill="#7a5230" />

        {/* coat */}
        <path
          d="M15 46 Q15 40 22 39 L38 39 Q45 40 45 46 L46 70 Q30 74 14 70 Z"
          fill="#2f5d8a"
        />
        <path d="M30 41 V71" fill="none" strokeWidth={0.9} opacity={0.6} />
        <rect x={14.5} y={60} width={31} height={4.5} rx={1} fill="#3a2a1c" />
        <rect x={26.5} y={59.5} width={7} height={5.5} rx={1} fill="#e3a92f" />

        {/* arms */}
        <path d="M17 45 Q9 53 11 61" fill="none" stroke="#2f5d8a" strokeWidth={6} />
        <path d="M17 45 Q9 53 11 61" fill="none" strokeWidth={0.8} opacity={0.4} />
        <path d="M43 45 Q50 49 50 54" fill="none" stroke="#2f5d8a" strokeWidth={6} />
        <circle cx={11} cy={62} r={3.6} fill="#f0c9a0" />
        <circle cx={50} cy={54} r={3.6} fill="#f0c9a0" />

        {/* face */}
        <circle cx={30} cy={30} r={11} fill="#f0c9a0" />

        {/* beard */}
        <path
          d="M19 31 Q20 38 23 44 Q26 52 30 55 Q34 52 37 44 Q40 38 41 31 Q36 37 30 37 Q24 37 19 31 Z"
          fill="#f7f3ea"
        />
        <path d="M24 46 Q27 49 30 49 M30 49 Q33 49 36 46" fill="none" strokeWidth={0.7} opacity={0.5} />
        {/* moustache */}
        <path d="M23 35 Q27 32 30 35 Q33 32 37 35 Q33 38 30 36 Q27 38 23 35 Z" fill="#f7f3ea" />

        {/* nose + eyes + cheeks */}
        <circle cx={30} cy={31.5} r={3.4} fill="#e2876f" />
        <circle cx={25.5} cy={27.5} r={1.3} fill={INK} stroke="none" />
        <circle cx={34.5} cy={27.5} r={1.3} fill={INK} stroke="none" />
        <circle cx={22} cy={31} r={2.2} fill="#e8a08a" stroke="none" opacity={0.6} />
        <circle cx={38} cy={31} r={2.2} fill="#e8a08a" stroke="none" opacity={0.6} />

        {/* hat */}
        <g className="pt-hat">
          <path
            d="M17 24 C 20 14, 25 6, 34 1 C 38 -1, 42 1, 40 4 C 37 9, 41 16, 43 24 Z"
            fill="#c8372d"
          />
          <path d="M16 24 Q30 20 44 24 Q45 27 44 28 Q30 24 16 28 Q15 26 16 24 Z" fill="#9e2a22" />
          <circle cx={40.5} cy={3.5} r={2.6} fill="#f7f3ea" />
        </g>
      </g>
    </svg>
  );
}
