"use client";

import { useState } from "react";

export type PackageInclude = {
  label: string;
  detail: string;
};

type PackageIncludesProps = {
  items: readonly PackageInclude[];
};

export function PackageIncludes({ items }: PackageIncludesProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mt-8 overflow-hidden rounded-lg bg-mist ring-1 ring-pine/20">
      <div className="border-b border-pine/15 bg-pine px-5 py-3 sm:px-6">
        <p className="font-display text-lg font-extrabold tracking-wide text-white sm:text-xl">
          Ce include
        </p>
      </div>
      <ul className="divide-y divide-pine/10">
        {items.map((item) => {
          const isOpen = openId === item.label;
          return (
            <li key={item.label}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenId((current) =>
                    current === item.label ? null : item.label,
                  )
                }
                className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-white/50 sm:px-6"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dawn"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-base font-semibold text-ink">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-pine underline decoration-pine/35 underline-offset-4">
                      {isOpen ? "Închide" : "Află mai multe"}
                    </span>
                  </span>
                  {isOpen ? (
                    <span className="mt-2 block text-sm leading-relaxed text-stone sm:text-base">
                      {item.detail}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
