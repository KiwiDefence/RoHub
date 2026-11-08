"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getMysteryTheme,
  mysteryThemes,
  type MysteryTheme,
} from "@/lib/mystery-box";
import { SITE_EMAIL, SITE_WHATSAPP } from "@/lib/seo";

type BookingDraft = {
  name: string;
  email: string;
  groupSize: string;
  month: string;
};

const STORAGE_KEY = "rohub-mystery-box";

type StoredState = {
  activeThemeId: string | null;
  unlockedClues: number;
  booking?: BookingDraft;
};

function loadState(): StoredState {
  if (typeof window === "undefined") {
    return { activeThemeId: null, unlockedClues: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { activeThemeId: null, unlockedClues: 0 };
    return JSON.parse(raw) as StoredState;
  } catch {
    return { activeThemeId: null, unlockedClues: 0 };
  }
}

function saveState(state: StoredState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function MysteryBoxApp() {
  const [ready, setReady] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [unlockedClues, setUnlockedClues] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const [booking, setBooking] = useState<BookingDraft>({
    name: "",
    email: "",
    groupSize: "10",
    month: "",
  });
  const [formNote, setFormNote] = useState("");

  useEffect(() => {
    const stored = loadState();
    setActiveThemeId(stored.activeThemeId);
    setUnlockedClues(stored.unlockedClues || (stored.activeThemeId ? 1 : 0));
    if (stored.booking) setBooking(stored.booking);
    setReady(true);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  const theme = useMemo(
    () => (activeThemeId ? getMysteryTheme(activeThemeId) : undefined),
    [activeThemeId],
  );

  const activateTheme = (id: string) => {
    setActiveThemeId(id);
    setUnlockedClues(1);
    setCountdown(0);
    saveState({ activeThemeId: id, unlockedClues: 1, booking });
  };

  const unlockNextClue = () => {
    if (!theme || unlockedClues >= theme.clues.length || countdown > 0) return;
    const next = unlockedClues + 1;
    setUnlockedClues(next);
    setCountdown(3);
    saveState({ activeThemeId, unlockedClues: next, booking });
  };

  const buildRequestBody = (t: MysteryTheme) => {
    return [
      `Mystery Box — ${t.title}`,
      `Nume: ${booking.name}`,
      `Email: ${booking.email}`,
      `Grup: ${booking.groupSize} persoane`,
      `Luna preferată: ${booking.month || "flexibil"}`,
      "",
      "Destinația rămâne secretă până aproape de plecare.",
    ].join("\n");
  };

  const submitBooking = (channel: "mailto" | "whatsapp") => {
    if (!theme) {
      setFormNote("Alege mai întâi o temă.");
      return;
    }
    if (!booking.name.trim() || !booking.email.trim()) {
      setFormNote("Completează numele și emailul.");
      return;
    }
    setFormNote("");
    saveState({ activeThemeId, unlockedClues, booking });

    const body = buildRequestBody(theme);
    if (channel === "mailto") {
      const subject = encodeURIComponent(`Rezervare Mystery Box — ${theme.title}`);
      window.location.href = `mailto:${SITE_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
      return;
    }
    const text = encodeURIComponent(
      `${theme.whatsappSeed}\n\n${body}`,
    );
    window.open(`${SITE_WHATSAPP}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  if (!ready) {
    return (
      <div className="rounded-xl border border-stone/15 bg-white p-8 text-center text-stone">
        Se încarcă Mystery Box…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Alege tema — nu destinația
        </h2>
        <p className="mt-2 max-w-2xl text-stone">
          Destinația rămâne secretă până cu câteva zile înainte de plecare.
          Primești doar temă, indicii și ritmul călătoriei.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {mysteryThemes.map((t) => {
            const selected = t.id === activeThemeId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => activateTheme(t.id)}
                className={`rounded-xl border p-5 text-left transition ${
                  selected
                    ? "border-dawn bg-dawn/10 shadow-md ring-2 ring-dawn/40"
                    : "border-stone/15 bg-white hover:border-pine/40"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dawn">
                  Mystery
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">
                  {t.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">
                  {t.teaser}
                </p>
                <p className="mt-4 text-sm font-medium text-pine">
                  {t.duration} · {t.priceFrom}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {theme ? (
        <section className="rounded-xl border border-pine/20 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-pine">
            Timeline indicii · {theme.title}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">
            Destinația rămâne secretă
          </h2>
          <p className="mt-2 text-sm text-stone">
            Indiciul 1 e imediat. Următoarele se „deblochează” ca pe WhatsApp —
            în demo, cu un countdown scurt pe scenă.
          </p>
          <ol className="mt-8 space-y-4">
            {theme.clues.map((clue, index) => {
              const open = index < unlockedClues;
              return (
                <li
                  key={clue.label}
                  className={`rounded-lg border p-4 ${
                    open
                      ? "border-moss/40 bg-moss/5"
                      : "border-dashed border-stone/25 bg-fog"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-pine">
                    {clue.label}
                  </p>
                  {open ? (
                    <p className="mt-2 text-base leading-relaxed text-ink">
                      {clue.text}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-stone">
                      Blocat — încă nu e timpul pe drip-ul real.
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
          {unlockedClues < theme.clues.length ? (
            <button
              type="button"
              onClick={unlockNextClue}
              disabled={countdown > 0}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-pine px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
            >
              {countdown > 0
                ? `Deblocare în ${countdown}s…`
                : unlockedClues === 1
                  ? "Deblochează indiciul 2 (Cu 7 zile înainte)"
                  : "Deblochează indiciul 3 (Cu 48h înainte)"}
            </button>
          ) : (
            <p className="mt-6 text-sm font-medium text-moss">
              Toate indiciile din drip sunt vizibile. Destinația exactă tot nu
              apare pe site — asta e punctul Mystery Box.
            </p>
          )}
        </section>
      ) : null}

      <section className="rounded-xl border border-dawn/30 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-2xl font-bold text-ink">
          Rezervă Mystery Box
        </h2>
        <p className="mt-2 text-sm text-stone">
          Fără backend: formularul deschide email sau WhatsApp cu cererea
          structurată — același tipar ca pe pagina de contact.
        </p>
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            submitBooking("mailto");
          }}
        >
          <label className="block sm:col-span-1">
            <span className="text-sm font-medium text-ink">Nume</span>
            <input
              required
              value={booking.name}
              onChange={(e) =>
                setBooking((b) => ({ ...b, name: e.target.value }))
              }
              className="mt-1.5 w-full rounded-md border border-pine/30 bg-fog px-4 py-3 outline-none ring-dawn focus:ring-2"
            />
          </label>
          <label className="block sm:col-span-1">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              required
              type="email"
              value={booking.email}
              onChange={(e) =>
                setBooking((b) => ({ ...b, email: e.target.value }))
              }
              className="mt-1.5 w-full rounded-md border border-pine/30 bg-fog px-4 py-3 outline-none ring-dawn focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Mărime grup</span>
            <input
              value={booking.groupSize}
              onChange={(e) =>
                setBooking((b) => ({ ...b, groupSize: e.target.value }))
              }
              className="mt-1.5 w-full rounded-md border border-pine/30 bg-fog px-4 py-3 outline-none ring-dawn focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Luna preferată</span>
            <input
              value={booking.month}
              onChange={(e) =>
                setBooking((b) => ({ ...b, month: e.target.value }))
              }
              placeholder="ex. mai 2027"
              className="mt-1.5 w-full rounded-md border border-pine/30 bg-fog px-4 py-3 outline-none ring-dawn focus:ring-2"
            />
          </label>
          {formNote ? (
            <p className="sm:col-span-2 text-sm font-medium text-red-700" role="alert">
              {formNote}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-pine px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-moss"
            >
              Trimite pe email
            </button>
            <button
              type="button"
              onClick={() => submitBooking("whatsapp")}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-dawn px-6 py-3.5 text-sm font-semibold text-ink shadow-md transition hover:brightness-110"
            >
              Deschide WhatsApp
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
