"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/vacante/", label: "Vacanțe" },
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
          className="font-display text-xl font-extrabold tracking-tight sm:text-2xl"
          onClick={() => setOpen(false)}
        >
          Rohub
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-white/85 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="rounded-sm bg-dawn px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Planifică vacanța
          </Link>
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
          id="mobile-nav"
          className="border-t border-white/10 px-5 py-6 md:hidden"
          aria-label="Mobil"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                className="mt-2 inline-block rounded-sm bg-dawn px-4 py-2 text-sm font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                Planifică vacanța
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
