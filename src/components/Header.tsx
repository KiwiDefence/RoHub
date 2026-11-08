"use client";

import { HashLink } from "@/components/HashLink";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/vacante/", label: "Vacanțe" },
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
          ? "bg-ink/90 text-white backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight sm:text-2xl"
          onClick={() => setOpen(false)}
        >
          RoHubTravel
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) =>
            link.href.includes("#") ? (
              <HashLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-white/85 transition hover:text-white"
              >
                {link.label}
              </HashLink>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-white/85 transition hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
          <HashLink
            href="/#contact"
            className="rounded-sm bg-dawn px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Planifică vacanța
          </HashLink>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center md:hidden"
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
          className="border-t border-white/10 px-5 py-6 md:hidden"
          aria-label="Mobil"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                {link.href.includes("#") ? (
                  <HashLink
                    href={link.href}
                    className="block text-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </HashLink>
                ) : (
                  <Link
                    href={link.href}
                    className="block text-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <HashLink
                href="/#contact"
                className="mt-2 inline-block rounded-sm bg-dawn px-4 py-2 text-sm font-semibold text-ink"
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
