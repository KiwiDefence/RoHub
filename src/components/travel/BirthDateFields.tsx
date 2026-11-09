"use client";

import { useEffect, useMemo, useState } from "react";

const MONTHS_RO = [
  { value: 1, label: "Ianuarie" },
  { value: 2, label: "Februarie" },
  { value: 3, label: "Martie" },
  { value: 4, label: "Aprilie" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Iunie" },
  { value: 7, label: "Iulie" },
  { value: 8, label: "August" },
  { value: 9, label: "Septembrie" },
  { value: 10, label: "Octombrie" },
  { value: 11, label: "Noiembrie" },
  { value: 12, label: "Decembrie" },
] as const;

type Parts = { day: number; month: number; year: number };

function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

function parseIso(iso: string): Parts {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return { day: 0, month: 0, year: 0 };
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
  };
}

function toIso(day: number, month: number, year: number): string {
  if (!day || !month || !year) return "";
  const max = daysInMonth(year, month);
  const d = Math.min(day, max);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function clampToMax(parts: Parts, maxIso?: string): Parts {
  if (!maxIso || !parts.year || !parts.month || !parts.day) return parts;
  const iso = toIso(parts.day, parts.month, parts.year);
  if (!iso || iso <= maxIso) return parts;
  return parseIso(maxIso);
}

const selectClass =
  "mt-1.5 w-full rounded-md border border-stone/30 bg-fog px-3 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20";

type BirthDateFieldsProps = {
  value: string;
  onChange: (iso: string) => void;
  /** ISO date — birth cannot be after this (usually trip start). */
  maxIso?: string;
  required?: boolean;
  idPrefix?: string;
};

export function BirthDateFields({
  value,
  onChange,
  maxIso,
  required = true,
  idPrefix = "birth",
}: BirthDateFieldsProps) {
  const [parts, setParts] = useState<Parts>(() => parseIso(value));

  useEffect(() => {
    const next = parseIso(value);
    setParts((prev) => {
      // Keep in-progress picks when parent still has an empty ISO.
      if (!value && (prev.day || prev.month || prev.year)) return prev;
      if (
        next.day === prev.day &&
        next.month === prev.month &&
        next.year === prev.year
      ) {
        return prev;
      }
      return next;
    });
  }, [value]);

  const max = maxIso ? parseIso(maxIso) : null;
  const maxYear =
    max?.year && max.year > 0 ? max.year : new Date().getFullYear();
  const minYear = 1920;

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) list.push(y);
    return list;
  }, [maxYear]);

  const months = MONTHS_RO;

  const dayCount = useMemo(() => {
    if (!parts.year || !parts.month) return 31;
    let maxDay = daysInMonth(parts.year, parts.month);
    if (
      max &&
      parts.year === max.year &&
      parts.month === max.month
    ) {
      maxDay = Math.min(maxDay, max.day);
    }
    return maxDay;
  }, [parts.year, parts.month, max]);

  const days = useMemo(() => {
    const list: number[] = [];
    for (let d = 1; d <= dayCount; d++) list.push(d);
    return list;
  }, [dayCount]);

  const commit = (next: Parts) => {
    let day = next.day;
    let month = next.month;
    let year = next.year;
    if (year && month && day) {
      const limit = daysInMonth(year, month);
      if (day > limit) day = limit;
    }
    const clamped = clampToMax({ day, month, year }, maxIso);
    setParts(clamped);
    onChange(toIso(clamped.day, clamped.month, clamped.year));
  };

  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
        Data nașterii
      </span>
      <div className="mt-0 grid grid-cols-3 gap-2">
        <label className="block min-w-0">
          <span className="sr-only">Zi</span>
          <select
            id={`${idPrefix}-day`}
            aria-label="Ziua nașterii"
            className={selectClass}
            value={parts.day || ""}
            required={required}
            onChange={(e) =>
              commit({
                ...parts,
                day: Number(e.target.value) || 0,
              })
            }
          >
            <option value="">Zi</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="sr-only">Lună</span>
          <select
            id={`${idPrefix}-month`}
            aria-label="Luna nașterii"
            className={selectClass}
            value={parts.month || ""}
            required={required}
            onChange={(e) =>
              commit({
                ...parts,
                month: Number(e.target.value) || 0,
              })
            }
          >
            <option value="">Lună</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="sr-only">An</span>
          <select
            id={`${idPrefix}-year`}
            aria-label="Anul nașterii"
            className={selectClass}
            value={parts.year || ""}
            required={required}
            onChange={(e) =>
              commit({
                ...parts,
                year: Number(e.target.value) || 0,
              })
            }
          >
            <option value="">An</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
