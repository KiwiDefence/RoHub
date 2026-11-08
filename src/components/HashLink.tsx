"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type HashLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Next.js Link often skips in-page hash scrolling on static export — handle it. */
export function HashLink({ href, onClick, children, ...props }: HashLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const hashIndex = href.indexOf("#");
    if (hashIndex < 0) return;

    const path = href.slice(0, hashIndex) || "/";
    const hash = href.slice(hashIndex + 1);
    if (!hash) return;

    const current =
      window.location.pathname.replace(/\/$/, "") || "/";
    const targetPath = path.replace(/\/$/, "") || "/";

    if (current === targetPath) {
      event.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${hash}`);
      }
    }
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
