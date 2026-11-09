"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { regions } from "@/lib/content";
import {
  DEMO_TRAVELS,
  googleMapsDirUrl,
  googleMapsUrl,
  normalizeTravel,
  wazeUrl,
  type DemoTravel,
  type DemoTravelDay,
  type DemoTravelSlot,
} from "@/lib/demo-travels";
import {
  cancelActiveBooking,
  dayRelation,
  slotState,
  travelDayIndex,
  tripPhase,
  updateActiveBooking,
  type DayRelation,
  type SlotState,
} from "@/lib/travel";
import { isNativeApp } from "@/lib/native";
import { SITE_PHONE_DISPLAY, SITE_WHATSAPP } from "@/lib/seo";
import {
  scheduleDemoNotificationSequence,
  setTripNotificationBooking,
  syncTripNotificationSchedule,
} from "@/lib/trip-notification";

const SLOT_LABEL: Record<SlotState, string> = {
  done: "Trecut",
  now: "Acum",
  next: "Urmează",
  later: "Mai târziu",
};

const CANCEL_FEE_RON = 150;
const noopSubscribe = () => () => {};

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateRo(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (!Number.isFinite(d.getTime())) return iso;
  return d.toLocaleDateString("ro-RO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function dayDateIso(startsOn: string, dayIndex: number): string {
  const d = new Date(`${startsOn}T12:00:00`);
  d.setDate(d.getDate() + dayIndex);
  return d.toISOString().slice(0, 10);
}

export function TravelHub() {
  const { ready, user, activeBooking, refresh } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModify, setShowModify] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoNote, setDemoNote] = useState("");
  const native = useSyncExternalStore(noopSubscribe, isNativeApp, () => false);
  const [editStartsOn, setEditStartsOn] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [editGuests, setEditGuests] = useState("2");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/cont/autentificare/?next=/calatorie/");
      return;
    }
    setTripNotificationBooking(activeBooking);
  }, [ready, user, activeBooking, router]);

  const liveDayIdx = activeBooking ? travelDayIndex(activeBooking) : 0;
  const phase = activeBooking ? tripPhase(activeBooking) : "before";
  const dayIdx = selectedDay ?? (phase === "before" ? 0 : liveDayIdx);

  const travel = useMemo(
    () =>
      activeBooking?.travel ? normalizeTravel(activeBooking.travel) : null,
    [activeBooking],
  );

  const focus = useMemo(() => {
    if (!activeBooking || !travel) return null;
    const day = travel.itinerary[dayIdx];
    if (!day?.slots?.length) return null;
    const relation = dayRelation(activeBooking, dayIdx);
    const states = day.slots.map((_, i) =>
      slotState(day.slots, i, relation),
    );
    const nowIndex = states.findIndex((s) => s === "now");
    const nextIndex = states.findIndex((s) => s === "next");
    return { day, relation, states, nowIndex, nextIndex };
  }, [activeBooking, travel, dayIdx]);

  if (!ready || !user) {
    return (
      <p className="px-5 py-28 text-center text-stone sm:px-8">
        Se încarcă călătoria…
      </p>
    );
  }

  if (!activeBooking?.travel) {
    return <EmptyTravelPicker />;
  }

  if (!travel) return null;

  const location = travel.location;
  const mapsEmbed = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;

  const openModify = () => {
    setEditStartsOn(activeBooking.startsOn);
    setEditNickname(activeBooking.nickname);
    setEditGuests(String(activeBooking.guests ?? 2));
    setShowModify(true);
    setNote("");
  };

  const saveModify = async (e: FormEvent) => {
    e.preventDefault();
    if (!editStartsOn) {
      setNote("Alege data de început.");
      return;
    }
    setBusy(true);
    setNote("");
    try {
      const updated = await updateActiveBooking({
        startsOn: editStartsOn,
        nickname: travel.includesPiticot
          ? editNickname.trim() || activeBooking.nickname
          : activeBooking.nickname,
        guests: Number(editGuests) || 1,
      });
      await refresh();
      await syncTripNotificationSchedule(updated);
      setSelectedDay(null);
      setShowModify(false);
      setNote("Rezervarea a fost actualizată.");
    } catch (err) {
      setNote(
        err instanceof ApiError ? err.message : "Nu am putut modifica rezervarea.",
      );
    } finally {
      setBusy(false);
    }
  };

  const confirmCancel = async () => {
    setBusy(true);
    try {
      await cancelActiveBooking();
      await syncTripNotificationSchedule(null);
      await refresh();
      setShowCancelModal(false);
      setShowModify(false);
      setNote("Rezervarea a fost anulată.");
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : "Nu am putut anula.");
    } finally {
      setBusy(false);
    }
  };

  const previewEndsOn = editStartsOn
    ? addDaysIso(editStartsOn, Math.max(1, travel.days) - 1)
    : activeBooking.endsOn;

  const phaseLabel =
    phase === "before"
      ? "Începe curând"
      : phase === "after"
        ? "Încheiată"
        : "În desfășurare";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
      <header className="flex flex-col gap-4 border-b border-stone/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
            Călătoria mea · {phaseLabel}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl">
            {travel.title}
          </h1>
          <p className="mt-2 text-sm text-stone sm:text-base">
            {formatDateRo(activeBooking.startsOn)} →{" "}
            {formatDateRo(activeBooking.endsOn)}
            {activeBooking.guests
              ? ` · ${activeBooking.guests} ${activeBooking.guests === 1 ? "persoană" : "persoane"}`
              : ""}
          </p>
          {activeBooking.paymentStatus === "paid" ||
          activeBooking.paymentStatus === "paid_demo" ||
          activeBooking.amountRon != null ? (
            <p className="mt-3 inline-flex rounded-sm bg-pine/10 px-3 py-1.5 text-xs font-semibold text-pine">
              Plătit
              {activeBooking.amountRon != null
                ? ` · ${activeBooking.amountRon} ${travel.currency ?? "RON"}`
                : ""}
              {activeBooking.id
                ? ` · #${activeBooking.id.slice(0, 8).toUpperCase()}`
                : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => (showModify ? setShowModify(false) : openModify())}
            className="rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {showModify ? "Închide" : "Modifică rezervarea"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowCancelModal(true)}
            className="rounded-sm border border-stone/25 bg-white px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60"
          >
            Anulează rezervarea
          </button>
          {native ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                void (async () => {
                  setDemoNote("");
                  try {
                    await scheduleDemoNotificationSequence(activeBooking);
                    setDemoNote(
                      "Notificările vor apărea în ~10s, 25s, 45s și 70s. Pune app-ul în background ca să le vezi clar.",
                    );
                  } catch {
                    setDemoNote("Nu am putut programa notificările.");
                  }
                })();
              }}
              className="rounded-sm border border-dawn/50 bg-dawn/20 px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60"
            >
              Previzualizare notificări
            </button>
          ) : null}
        </div>
      </header>
      {demoNote ? (
        <p className="mt-4 rounded-sm bg-mist/80 px-4 py-3 text-sm text-stone">
          {demoNote}
        </p>
      ) : null}

      {showModify ? (
        <form
          onSubmit={(e) => void saveModify(e)}
          className="mt-6 grid gap-4 border border-stone/15 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="font-display text-lg font-bold text-ink">
              Datele rezervării
            </h3>
            <p className="mt-1 text-sm text-stone">
              Pachetul rămâne <b>{travel.title}</b>. Schimbi perioada și
              detaliile.
            </p>
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
              Data începerii
            </span>
            <input
              type="date"
              value={editStartsOn}
              onChange={(e) => setEditStartsOn(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone/30 bg-fog px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
              required
            />
          </label>
          <div className="rounded-sm bg-mist/80 px-3 py-3 text-sm text-stone">
            <p className="text-xs font-bold uppercase tracking-wide">Sfârșit</p>
            <p className="mt-1 font-semibold text-ink">
              {formatDateRo(previewEndsOn)} · {travel.days} zile
            </p>
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
              Număr persoane
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={editGuests}
              onChange={(e) => setEditGuests(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone/30 bg-fog px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
              required
            />
          </label>
          {travel.includesPiticot ? (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
                Porecla în Piticot
              </span>
              <input
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-stone/30 bg-fog px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
                required
              />
            </label>
          ) : (
            <div />
          )}
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={busy}
              className="rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Se salvează…" : "Salvează modificările"}
            </button>
          </div>
        </form>
      ) : null}

      {note ? <p className="mt-4 text-sm text-stone">{note}</p> : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.9fr)] lg:items-start">
        <div className="min-w-0 space-y-6">
          {focus && (focus.nowIndex >= 0 || focus.nextIndex >= 0) ? (
            <div className="lg:hidden">
              <NowCard
                day={focus.day}
                slot={
                  focus.day.slots[
                    focus.nowIndex >= 0 ? focus.nowIndex : focus.nextIndex
                  ]
                }
                kind={focus.nowIndex >= 0 ? "now" : "next"}
              />
            </div>
          ) : null}

          <section>
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
                Program
              </h2>
              <p className="text-xs font-medium text-stone">
                Ziua {dayIdx + 1} din {travel.itinerary.length}
              </p>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {travel.itinerary.map((day, i) => {
                const iso = dayDateIso(activeBooking.startsOn, i);
                const rel = dayRelation(activeBooking, i);
                const active = i === dayIdx;
                return (
                  <button
                    key={day.title}
                    type="button"
                    onClick={() => setSelectedDay(i)}
                    className={`min-w-[5.5rem] shrink-0 rounded-sm px-3 py-2.5 text-left transition sm:min-w-[7rem] ${
                      active
                        ? "bg-pine text-white"
                        : "bg-white text-ink ring-1 ring-stone/15"
                    }`}
                  >
                    <p className="text-[0.65rem] font-bold uppercase tracking-wide opacity-80">
                      Ziua {i + 1}
                      {rel === "today" ? " · azi" : ""}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold leading-snug">
                      {formatDateRo(iso)}
                    </p>
                  </button>
                );
              })}
            </div>

            {focus ? (
              <ScheduleTimeline
                day={focus.day}
                relation={focus.relation}
                states={focus.states}
              />
            ) : null}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          {focus && (focus.nowIndex >= 0 || focus.nextIndex >= 0) ? (
            <div className="hidden lg:block">
              <NowCard
                day={focus.day}
                slot={
                  focus.day.slots[
                    focus.nowIndex >= 0 ? focus.nowIndex : focus.nextIndex
                  ]
                }
                kind={focus.nowIndex >= 0 ? "now" : "next"}
              />
            </div>
          ) : null}

          <section className="bg-white p-5 ring-1 ring-stone/15">
            <h2 className="font-display text-xl font-bold text-ink">Locație</h2>
            <p className="mt-1 font-semibold text-ink">{location.name}</p>
            <p className="text-sm text-stone">{location.address}</p>
            <p className="mt-1 text-sm text-stone">
              Întâlnire: {travel.meetingPoint}
            </p>

            <div className="mt-3 overflow-hidden rounded-sm ring-1 ring-stone/15">
              <iframe
                title={`Hartă ${location.name}`}
                src={mapsEmbed}
                className="h-48 w-full border-0 bg-mist lg:h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={googleMapsDirUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-sm bg-pine px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Google Maps
              </a>
              <a
                href={wazeUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-sm border border-stone/25 bg-fog px-3 py-3 text-center text-sm font-semibold text-ink"
              >
                Waze
              </a>
            </div>
            <a
              href={googleMapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-pine underline decoration-dotted underline-offset-4"
            >
              Vezi locația pe hartă
            </a>
          </section>

          {travel.includesPiticot ? (
            <section className="bg-pine px-5 py-5 text-white">
              <h2 className="font-display text-xl font-bold">Piticot</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                Jocul de pe traseu al lui{" "}
                <span className="font-semibold text-white">
                  {activeBooking.nickname}
                </span>
                . La fiecare oprire scanezi QR-ul și avansezi pe tablă.
              </p>
              <Link
                href="/inovatie/piticot/"
                className="mt-4 inline-flex w-full items-center justify-center rounded-sm bg-dawn px-5 py-3 text-center text-sm font-semibold text-ink"
              >
                Deschide tabla Piticot
              </Link>
            </section>
          ) : null}

          <section className="bg-white p-5 ring-1 ring-stone/15">
            <h2 className="font-display text-lg font-bold text-ink">Ajutor</h2>
            <p className="mt-1 text-sm text-stone">
              Programul și locația sunt pe această pagină. WhatsApp e doar pentru
              probleme pe traseu.
            </p>
            <a
              href={`${SITE_WHATSAPP}?text=${encodeURIComponent("Am o problemă pe călătoria RoHubTravel.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-sm border border-stone/25 px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Ai o problemă? WhatsApp
            </a>
            <p className="mt-3 text-xs text-stone">{SITE_PHONE_DISPLAY}</p>
            {travel.tips.length ? (
              <ul className="mt-4 space-y-2 text-sm text-stone">
                {travel.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dawn" />
                    {tip}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </aside>
      </div>

      {showCancelModal ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-4 sm:items-center"
          role="presentation"
          onClick={() => !busy && setShowCancelModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            className="w-full max-w-md rounded-sm bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="cancel-title"
              className="font-display text-xl font-bold text-ink"
            >
              Anulezi rezervarea?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Anularea completă percepe o taxă de anulare de{" "}
              <b className="text-ink">{CANCEL_FEE_RON} RON</b>. Dacă vrei doar
              să schimbi data sau numărul de persoane, folosește „Modifică
              rezervarea”.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={() => setShowCancelModal(false)}
                className="rounded-sm border border-stone/25 px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-60"
              >
                Renunță
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmCancel()}
                className="rounded-sm bg-[#b3261e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Se anulează…" : "Confirmă anularea"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function regionForTravel(travel: DemoTravel) {
  return regions.find((r) => r.slug === travel.regionSlug);
}

function EmptyTravelPicker() {
  const hero = regionForTravel(DEMO_TRAVELS[0]!) ?? regions[0]!;

  return (
    <div className="pb-16">
      <section className="relative isolate min-h-[min(72vh,36rem)] overflow-hidden bg-ink text-white">
        <Image
          src={hero.image}
          alt={hero.heroAlt}
          fill
          priority
          sizes="100vw"
          className="animate-hero-ken object-cover opacity-55"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #d4920a 0%, transparent 42%), radial-gradient(circle at 80% 10%, #2d6a4f 0%, transparent 35%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[min(72vh,36rem)] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-dawn">
            RoHubTravel
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Călătoria mea
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Alege pachetul. După plată ai aici programul zilei, harta și
            Piticot — totul într-un singur loc.
          </p>
          <a
            href="#pachete-calatorie"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-sm bg-dawn px-5 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/25 transition hover:brightness-110"
          >
            Vezi pachetele
            <span aria-hidden>↓</span>
          </a>
        </div>
      </section>

      <section
        id="pachete-calatorie"
        className="relative mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Pachete disponibile
            </h2>
            <p className="mt-2 max-w-lg text-sm text-stone sm:text-base">
              Un pachet activ odată. Poți modifica data și numărul de persoane
              după confirmare.
            </p>
          </div>
          <Link
            href="/cont/"
            className="text-sm font-medium text-stone underline decoration-dotted underline-offset-4"
          >
            Contul meu
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {DEMO_TRAVELS.map((t, i) => (
            <PackagePick key={t.id} travel={t} featured={i === 0} />
          ))}
        </ul>

        <ol className="mt-14 grid gap-6 border-t border-stone/15 pt-10 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Alegi și plătești",
              text: "Confirmi pachetul, data și numărul de persoane.",
            },
            {
              n: "02",
              title: "Urmărești ziua",
              text: "Program pe ore, locație pe hartă, Maps și Waze.",
            },
            {
              n: "03",
              title: "Scanezi pe traseu",
              text: "Piticot se deschide din Călătoria mea, pe telefon.",
            },
          ].map((step) => (
            <li key={step.n}>
              <p className="font-display text-2xl font-extrabold text-dawn">
                {step.n}
              </p>
              <p className="mt-2 font-display text-lg font-bold text-ink">
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-stone">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function PackagePick({
  travel,
  featured,
}: {
  travel: DemoTravel;
  featured?: boolean;
}) {
  const region = regionForTravel(travel);
  const image = region?.image ?? "/regions/hero.webp";
  const alt = region?.heroAlt ?? travel.title;
  const price = travel.priceRon;

  return (
    <li
      className={`group relative isolate min-h-[28rem] overflow-hidden rounded-[1.25rem] bg-ink text-white shadow-[0_24px_60px_-28px_rgba(15,31,26,0.55)] ring-1 ring-ink/10 ${
        featured ? "lg:min-h-[32rem]" : ""
      }`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10"
        aria-hidden
      />
      <div className="relative z-10 flex h-full min-h-[28rem] flex-col justify-end p-6 sm:p-8 lg:min-h-[inherit]">
        <div className="flex flex-wrap items-center gap-2">
          {travel.includesPiticot ? (
            <span className="bg-dawn px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-ink">
              Include Piticot
            </span>
          ) : (
            <span className="bg-white/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white/90">
              Fără Piticot
            </span>
          )}
          <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
            {travel.days} zile
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
          {travel.title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
          {travel.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/55">
              Perioadă tipică
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {formatDateRo(travel.startsOn)} → {formatDateRo(travel.endsOn)}
            </p>
            {price != null ? (
              <p className="mt-2 font-display text-2xl font-extrabold text-dawn">
                {price} {travel.currency ?? "RON"}
                <span className="ml-1 text-sm font-semibold text-white/70">
                  / persoană
                </span>
              </p>
            ) : null}
          </div>
          <Link
            href={`/calatorie/rezerva/${travel.id}/`}
            className="inline-flex items-center justify-center rounded-sm bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-dawn"
          >
            Alege pachetul
          </Link>
        </div>
      </div>
    </li>
  );
}

function NowCard({
  day,
  slot,
  kind,
}: {
  day: DemoTravelDay;
  slot: DemoTravelSlot;
  kind: "now" | "next";
}) {
  return (
    <section
      className={`px-5 py-5 ${
        kind === "now"
          ? "border-l-4 border-dawn bg-white"
          : "border-l-4 border-pine/40 bg-white"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-stone">
        {kind === "now" ? "Se întâmplă acum" : "Urmează"} · {day.title}
      </p>
      <p className="mt-2 font-mono text-sm font-semibold text-pine">
        {slot.time}
      </p>
      <h2 className="mt-0.5 font-display text-2xl font-bold text-ink">
        {slot.title}
      </h2>
      {slot.detail ? (
        <p className="mt-2 text-sm leading-relaxed text-stone">{slot.detail}</p>
      ) : null}
      {slot.place ? (
        <p className="mt-2 text-sm font-medium text-ink">{slot.place}</p>
      ) : null}
    </section>
  );
}

function ScheduleTimeline({
  day,
  relation,
  states,
}: {
  day: DemoTravelDay;
  relation: DayRelation;
  states: SlotState[];
}) {
  return (
    <ol className="relative mt-5 space-y-0 border-l-2 border-stone/15 ml-3">
      {day.slots.map((slot, i) => {
        const state = states[i] ?? "later";
        const isNow = state === "now";
        const isNext = state === "next";
        const muted = state === "done" || state === "later";

        return (
          <li key={`${slot.time}-${slot.title}`} className="relative pl-6 pb-6 last:pb-0">
            <span
              className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-2 ring-fog ${
                isNow
                  ? "bg-dawn"
                  : isNext
                    ? "bg-pine"
                    : state === "done"
                      ? "bg-stone/40"
                      : "bg-white ring-stone/30"
              }`}
            />
            <div
              className={`rounded-sm px-4 py-3 ${
                isNow
                  ? "bg-dawn/15 ring-1 ring-dawn/40"
                  : isNext
                    ? "bg-white ring-1 ring-pine/25"
                    : "bg-white/80"
              } ${muted && !isNext ? "opacity-60" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-pine">
                  {slot.time}
                </span>
                {(isNow || isNext || (relation === "today" && state === "done")) && (
                  <span
                    className={`rounded-sm px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${
                      isNow
                        ? "bg-dawn text-ink"
                        : isNext
                          ? "bg-pine text-white"
                          : "bg-stone/15 text-stone"
                    }`}
                  >
                    {SLOT_LABEL[state]}
                  </span>
                )}
              </div>
              <p className="mt-1 font-display text-base font-bold text-ink">
                {slot.title}
              </p>
              {slot.detail ? (
                <p className="mt-1 text-sm leading-relaxed text-stone">
                  {slot.detail}
                </p>
              ) : null}
              {slot.place ? (
                <p className="mt-1.5 text-xs font-medium text-stone">
                  {slot.place}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
