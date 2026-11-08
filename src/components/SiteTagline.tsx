type SiteTaglineProps = {
  className?: string;
  /** Soften surrounding words so SIMTE reads bolder in large display headings */
  contrastSimte?: boolean;
};

/** Visible motto with SIMTE emphasized. Use SITE_TAGLINE for plain-text/SEO. */
export function SiteTagline({
  className,
  contrastSimte = false,
}: SiteTaglineProps) {
  return (
    <span className={className}>
      {contrastSimte ? (
        <>
          <span className="font-semibold">Descoperă, Trăiește, </span>
          <strong className="font-extrabold">SIMTE</strong>
          <span className="font-semibold"> România.</span>
        </>
      ) : (
        <>
          Descoperă, Trăiește, <strong>SIMTE</strong> România.
        </>
      )}
    </span>
  );
}
