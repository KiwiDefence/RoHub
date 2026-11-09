"use client";

import { HashLink } from "@/components/HashLink";
import { BRAND_LOGO_MARK } from "@/lib/seo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const links = [
  { href: "/vacante/", label: "Vacanțe" },
  { href: "/calatorie/", label: "Călătoria mea" },
  { href: "/cont/", label: "Cont" },
  { href: "/servicii-b2b/", label: "Servicii" },
  { href: "/echipa/", label: "Echipa" },
  { href: "/#despre", label: "Despre" },
  { href: "/#contact", label: "Contact" },
] as const;

type HeaderProps = {
  variant?: "overlay" | "solid";
};

export function Header({ variant = "overlay" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = variant === "solid" || scrolled || open;
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (variant === "solid") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!open) return;
    const el = menuRef.current;
    if (!el) return;

    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handler(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    el.focus();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-ink text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center"
          onClick={() => setOpen(false)}
          aria-label="RoHubTravel — acasă"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}${BRAND_LOGO_MARK}`}
            alt="RoHubTravel"
            width={220}
            height={90}
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) =>
            link.href.includes("#") ? (
              <HashLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-white underline decoration-white/30 decoration-1 underline-offset-4 transition hover:text-white hover:decoration-white/70"
              >
                {link.label}
              </HashLink>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-white underline decoration-white/30 decoration-1 underline-offset-4 transition hover:text-white hover:decoration-white/70"
              >
                {link.label}
              </Link>
            ),
          )}
          <HashLink
            href="/#contact"
            className="rounded-md bg-dawn px-5 py-2.5 text-sm font-semibold text-ink shadow-md shadow-black/25 ring-1 ring-dawn/50 transition hover:brightness-110"
          >
            Planifică vacanța
          </HashLink>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/35 bg-ink/70 text-white shadow-md shadow-black/30 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Meniu</span>
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-5 bg-current transition ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <nav
          ref={menuRef}
          tabIndex={-1}
          id="mobile-nav"
          className="border-t border-white/15 bg-ink px-5 py-7 md:hidden"
          aria-label="Mobil"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                {link.href.includes("#") ? (
                  <HashLink
                    href={link.href}
                    className="block rounded-md px-3 py-3 text-lg font-medium text-white underline decoration-white/35 decoration-1 underline-offset-[6px] transition hover:bg-white/10 hover:decoration-white/70"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </HashLink>
                ) : (
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-3 text-lg font-medium text-white underline decoration-white/35 decoration-1 underline-offset-[6px] transition hover:bg-white/10 hover:decoration-white/70"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-3">
              <HashLink
                href="/#contact"
                className="flex w-full items-center justify-center rounded-md bg-dawn px-5 py-3.5 text-base font-semibold text-ink shadow-md shadow-black/30 ring-1 ring-dawn/50"
                onClick={() => setOpen(false)}
              >
                Planifică vacanța
              </HashLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
