import Link from "next/link";

export type Crumb = {
  name: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  tone?: "light" | "dark";
};

export function Breadcrumbs({ items, tone = "dark" }: BreadcrumbsProps) {
  const muted = tone === "light" ? "text-white/70" : "text-stone";
  const current = tone === "light" ? "text-white" : "text-ink";
  const sep = tone === "light" ? "text-white/40" : "text-stone/40";

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span className={sep} aria-hidden>
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`${muted} underline-offset-4 hover:underline`}
                >
                  {item.name}
                </Link>
              ) : (
                <span className={current} aria-current={isLast ? "page" : undefined}>
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
