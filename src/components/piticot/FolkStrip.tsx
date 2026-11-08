/** Thin band of the red folk motif used around the board, for HTML screens. */
export function FolkStrip({ className = "" }: { className?: string }) {
  return (
    <svg className={`block h-[14px] w-full ${className}`} aria-hidden>
      <defs>
        <pattern id="pt-folk-strip" width="16" height="14" patternUnits="userSpaceOnUse">
          <rect width="16" height="14" fill="#b3261e" />
          <path d="M8 1.5 L14 7 L8 12.5 L2 7 Z" fill="#f4ead2" />
          <path d="M8 4.6 L10.4 7 L8 9.4 L5.6 7 Z" fill="#1f1a17" />
          <path d="M0 4.5 L2.5 7 L0 9.5 Z M16 4.5 L13.5 7 L16 9.5 Z" fill="#1f1a17" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill="url(#pt-folk-strip)" />
      <path d="M0 0.75 H10000 M0 13.25 H10000" stroke="#3a2a1c" strokeWidth={1.5} />
    </svg>
  );
}
