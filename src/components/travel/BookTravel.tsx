"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { getDemoTravel } from "@/lib/demo-travels";
import { isNativeApp } from "@/lib/native";
import { BirthDateFields } from "@/components/travel/BirthDateFields";
import { asset } from "@/lib/content";
import {
  cardBrandLabel,
  cardBrandLogo,
  detectCardBrand,
  digitsOnly,
  formatCardCvc,
  formatCardExpiry,
  formatCardNumber,
} from "@/lib/card-payment";
import { downloadBookingInvoice } from "@/lib/invoice";
import {
  ageOnDate,
  createBooking,
  type BookingTraveler,
} from "@/lib/travel";
import {
  requestTripNotificationPermission,
  syncTripNotificationSchedule,
} from "@/lib/trip-notification";

type Step = "details" | "pay" | "done";

type TravelerDraft = {
  name: string;
  phone: string;
  birthDate: string;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

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

function emptyTraveler(name = ""): TravelerDraft {
  return { name, phone: "", birthDate: "" };
}

function resizeTravelers(
  list: TravelerDraft[],
  count: number,
  leadName: string,
): TravelerDraft[] {
  const next = list.slice(0, count);
  while (next.length < count) {
    next.push(emptyTraveler(next.length === 0 ? leadName : ""));
  }
  if (next[0] && !next[0].name) next[0] = { ...next[0], name: leadName };
  return next;
}

const fieldClass =
  "mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20";
const fieldFogClass =
  "mt-1.5 w-full rounded-md border border-stone/30 bg-fog px-3.5 py-3 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20";
const labelClass =
  "text-xs font-bold uppercase tracking-[0.14em] text-stone";

export function BookTravel({ travelId }: { travelId: string }) {
  const travel = getDemoTravel(travelId);
  const { ready, user, activeBooking, refresh, setSession } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [nickname, setNickname] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [travelers, setTravelers] = useState<TravelerDraft[]>([
    emptyTraveler(),
    emptyTraveler(),
  ]);
  const [agesConfirmed, setAgesConfirmed] = useState(false);
  const [startsOn, setStartsOn] = useState(todayIso);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(
        `/cont/autentificare/?next=${encodeURIComponent(`/calatorie/rezerva/${travelId}/`)}`,
      );
      return;
    }
    if (activeBooking && step !== "done") {
      router.replace("/calatorie/");
      return;
    }
    setNickname((prev) => prev || user.name);
    setCardName((prev) => prev || user.name);
    setTravelers((prev) => {
      if (prev.some((t) => t.name || t.phone || t.birthDate)) return prev;
      return resizeTravelers(prev, guestCount, user.name);
    });
  }, [ready, user, activeBooking, router, travelId, step, guestCount]);

  const endsOn = useMemo(() => {
    if (!travel) return startsOn;
    return addDaysIso(startsOn, Math.max(1, travel.days) - 1);
  }, [travel, startsOn]);

  const totalRon = (travel?.priceRon ?? 0) * guestCount;
  const minAge = travel?.minAge;
  const cardBrand = detectCardBrand(cardNumber);
  const cardLogo = cardBrandLogo(cardBrand);

  const updateTraveler = (
    index: number,
    field: keyof TravelerDraft,
    value: string,
  ) => {
    setTravelers((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const setCount = (n: number) => {
    const count = Math.min(20, Math.max(1, n));
    setGuestCount(count);
    setTravelers((prev) =>
      resizeTravelers(prev, count, user?.name ?? ""),
    );
    setAgesConfirmed(false);
  };

  if (!travel) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8">
        <p className="text-stone">Pachetul nu există.</p>
        <Link href="/calatorie/" className="mt-4 inline-block text-pine underline">
          Înapoi
        </Link>
      </div>
    );
  }

  if (!ready || !user || (activeBooking && step !== "done")) {
    return (
      <p className="py-20 text-center text-stone">Se pregătește rezervarea…</p>
    );
  }

  const validateTravelers = (): BookingTraveler[] | null => {
    for (let i = 0; i < guestCount; i++) {
      const row = travelers[i];
      if (!row?.name.trim()) {
        setError(`Persoana ${i + 1}: completează numele.`);
        return null;
      }
      if (row.phone.replace(/\D/g, "").length < 8) {
        setError(`Persoana ${i + 1}: completează un telefon valid.`);
        return null;
      }
      if (!row.birthDate) {
        setError(`Persoana ${i + 1}: completează data nașterii.`);
        return null;
      }
      const age = ageOnDate(row.birthDate, startsOn);
      if (age < 0) {
        setError(`Persoana ${i + 1}: data nașterii e invalidă.`);
        return null;
      }
      if (minAge != null && age < minAge) {
        setError(
          `Persoana ${i + 1} are ${age} ani — minimul pentru acest pachet e ${minAge} ani.`,
        );
        return null;
      }
    }
    if (!agesConfirmed) {
      setError(
        "Bifează confirmarea vârstelor — verificăm eligibilitatea pe baza datelor de naștere.",
      );
      return null;
    }
    return travelers.slice(0, guestCount).map((t) => ({
      name: t.name.trim(),
      phone: t.phone.trim(),
      birthDate: t.birthDate,
    }));
  };

  const goPay = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!startsOn) {
      setError("Alege data de început.");
      return;
    }
    if (!nickname.trim()) {
      setError("Scrie porecla pentru Piticot.");
      return;
    }
    if (!validateTravelers()) return;
    setStep("pay");
  };

  const payAndBook = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const people = validateTravelers();
    if (!people) return;
    if (!cardName.trim() || digitsOnly(cardNumber).length < 12) {
      setError("Completează datele cardului.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
      setError("Expirarea trebuie să fie LL/AA.");
      return;
    }
    const cvcLen = detectCardBrand(cardNumber) === "amex" ? 4 : 3;
    if (digitsOnly(cardCvc).length < cvcLen) {
      setError(`CVC-ul trebuie să aibă ${cvcLen} cifre.`);
      return;
    }
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const booking = await createBooking({
        travelId: travel.id,
        nickname: nickname.trim() || people[0]?.name || user.name,
        guests: people.length,
        startsOn,
        travelers: people,
        agesConfirmed: true,
      });
      await refresh();
      setSession({ user, activeBooking: booking });
      setOrderId(booking.id.slice(0, 8).toUpperCase());
      setStep("done");
      if (isNativeApp()) {
        await requestTripNotificationPermission();
        await syncTripNotificationSchedule(booking);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Plata a eșuat");
    } finally {
      setBusy(false);
    }
  };

  const summaryAside = (
    <aside className="space-y-4 lg:sticky lg:top-28">
      <div className="border border-stone/15 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
          Rezumat
        </p>
        <h2 className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">
          {travel.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">{travel.summary}</p>
        <dl className="mt-5 space-y-3 border-t border-stone/10 pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Perioadă</dt>
            <dd className="text-right font-semibold text-ink">
              {formatDateRo(startsOn)} → {formatDateRo(endsOn)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Durată</dt>
            <dd className="font-semibold text-ink">{travel.days} zile</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Persoane</dt>
            <dd className="font-semibold text-ink">{guestCount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Preț / persoană</dt>
            <dd className="font-semibold text-ink">
              {travel.priceRon} {travel.currency}
            </dd>
          </div>
          {minAge != null ? (
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Vârstă minimă</dt>
              <dd className="font-semibold text-ink">{minAge}+ ani</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-5 rounded-sm bg-mist/80 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-stone">
            Total
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {totalRon} {travel.currency}
          </p>
        </div>
        {step === "pay" ? (
          <ul className="mt-4 space-y-1 border-t border-stone/10 pt-4 text-sm text-stone">
            {travelers.slice(0, guestCount).map((t) => (
              <li key={`${t.name}-${t.phone}`}>
                <span className="font-semibold text-ink">{t.name || "—"}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-4 text-xs text-stone">
          Include Piticot pe traseu · transport pe circuit
        </p>
      </div>
    </aside>
  );

  if (step === "done") {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-16 sm:px-8">
        <div className="border border-stone/15 bg-white p-6 text-center sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
            Comandă confirmată
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Plata a reușit
          </h1>
          <p className="mx-auto mt-4 max-w-md text-stone">
            Ai cumpărat{" "}
            <span className="font-semibold text-ink">{travel.title}</span>.
          </p>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-stone">
            Cod comandă
          </p>
          <p className="mt-3 font-display text-4xl font-extrabold tracking-[0.12em] text-pine sm:text-5xl">
            {orderId}
          </p>
          <p className="mt-3 text-sm text-stone">
            {formatDateRo(startsOn)} → {formatDateRo(endsOn)} · {guestCount}{" "}
            {guestCount === 1 ? "persoană" : "persoane"} · {totalRon}{" "}
            {travel.currency}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => router.push("/calatorie/")}
              className="rounded-sm bg-pine px-6 py-3 text-sm font-semibold text-white"
            >
              Deschide Călătoria mea
            </button>
            <button
              type="button"
              onClick={() =>
                downloadBookingInvoice({
                  orderId,
                  travelTitle: travel.title,
                  startsOn,
                  endsOn,
                  days: travel.days,
                  guests: guestCount,
                  unitPriceRon: travel.priceRon ?? 0,
                  currency: travel.currency ?? "RON",
                  totalRon,
                  travelers: travelers.slice(0, guestCount).map((t) => ({
                    name: t.name.trim(),
                    phone: t.phone.trim(),
                    birthDate: t.birthDate,
                  })),
                  customerName: user.name,
                  customerEmail: user.email,
                })
              }
              className="rounded-sm border border-stone/25 bg-white px-6 py-3 text-sm font-semibold text-ink"
            >
              Descarcă factura
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <header className="mb-8 max-w-3xl border-b border-stone/15 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
          {step === "details" ? "Pasul 1 · detalii" : "Pasul 2 · plată"}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl">
          Rezervă pachetul
        </h1>
        <p className="mt-3 text-stone lg:text-lg">
          Completează persoanele, confirmă vârstele și plătește. Piticot e inclus
          pe traseu.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.85fr)] lg:items-start">
        <div className="min-w-0">
          {step === "details" ? (
            <form onSubmit={goPay} className="space-y-6">
              <section className="border border-stone/15 bg-white p-5 sm:p-6">
                <h2 className="font-display text-xl font-bold text-ink">
                  Perioadă & persoane
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="block">
                    <span className={labelClass}>Data începerii</span>
                    <input
                      type="date"
                      value={startsOn}
                      onChange={(e) => setStartsOn(e.target.value)}
                      className={fieldClass}
                      required
                    />
                  </label>
                  <div className="rounded-sm bg-mist/80 px-3.5 py-3">
                    <p className={labelClass}>Se încheie</p>
                    <p className="mt-2 font-semibold text-ink">
                      {formatDateRo(endsOn)} · {travel.days} zile
                    </p>
                  </div>
                  <label className="block sm:col-span-2 lg:col-span-1">
                    <span className={labelClass}>Număr persoane</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={guestCount}
                      onChange={(e) => setCount(Number(e.target.value) || 1)}
                      className={fieldClass}
                      required
                    />
                  </label>
                </div>
                <label className="mt-4 block max-w-md">
                  <span className={labelClass}>Porecla în Piticot</span>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className={fieldClass}
                    required
                  />
                </label>
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">
                    Datele fiecărei persoane
                  </h2>
                  <p className="mt-2 text-sm text-stone">
                    Nume, telefon și data nașterii
                    {minAge != null
                      ? ` — minim ${minAge} ani la data plecării`
                      : ""}
                    .
                  </p>
                </div>
                {travelers.slice(0, guestCount).map((row, index) => (
                    <fieldset
                      key={index}
                      className="grid gap-4 border border-stone/15 bg-white p-5 sm:grid-cols-3 sm:p-6"
                    >
                      <legend className="px-1 text-sm font-bold text-ink">
                        Persoana {index + 1}
                        {index === 0 ? " · titular" : ""}
                      </legend>
                      <label className="block">
                        <span className={labelClass}>Nume complet</span>
                        <input
                          value={row.name}
                          onChange={(e) =>
                            updateTraveler(index, "name", e.target.value)
                          }
                          className={fieldFogClass}
                          autoComplete="name"
                          required
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>Telefon</span>
                        <input
                          type="tel"
                          value={row.phone}
                          onChange={(e) =>
                            updateTraveler(index, "phone", e.target.value)
                          }
                          placeholder="+40 7xx xxx xxx"
                          className={fieldFogClass}
                          autoComplete="tel"
                          required
                        />
                      </label>
                      <BirthDateFields
                        idPrefix={`book-p${index}`}
                        value={row.birthDate}
                        maxIso={startsOn}
                        onChange={(iso) => {
                          updateTraveler(index, "birthDate", iso);
                          setAgesConfirmed(false);
                        }}
                      />
                    </fieldset>
                  ))}
              </section>

              <label className="flex items-start gap-3 rounded-sm bg-mist/80 px-4 py-3 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={agesConfirmed}
                  onChange={(e) => setAgesConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-pine"
                  required
                />
                <span>
                  Confirm că datele de naștere sunt corecte pentru toate
                  persoanele și că fiecare îndeplinește vârsta minimă a
                  pachetului
                  {minAge != null ? ` (${minAge}+ ani)` : ""}.
                </span>
              </label>

              {error ? (
                <p className="text-sm font-semibold text-red-700" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="rounded-sm bg-pine px-6 py-3 text-sm font-semibold text-white"
                >
                  Continuă la plată · {totalRon} {travel.currency}
                </button>
                <p className="text-sm text-stone lg:hidden">
                  Total:{" "}
                  <b className="text-ink">
                    {totalRon} {travel.currency}
                  </b>
                </p>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(e) => void payAndBook(e)}
              className="space-y-6 border border-stone/15 bg-white p-5 sm:p-6"
            >
              <div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Plată cu cardul
                </h2>
                <p className="mt-2 text-sm text-stone">
                  Card de test — nu se încasează bani reali.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Nume pe card</span>
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={fieldClass}
                    autoComplete="cc-name"
                    required
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Număr card</span>
                  <span className="relative mt-1.5 block">
                    <input
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      placeholder="4242 4242 4242 4242"
                      className="w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 pr-16 outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      required
                    />
                    {cardLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset(cardLogo)}
                        alt={cardBrandLabel(cardBrand)}
                        title={cardBrandLabel(cardBrand)}
                        className="pointer-events-none absolute right-3 top-1/2 h-7 w-auto -translate-y-1/2 object-contain"
                      />
                    ) : null}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-2">
                    {(
                      [
                        "visa",
                        "mastercard",
                        "amex",
                        "discover",
                      ] as const
                    ).map((brand) => {
                      const logo = cardBrandLogo(brand);
                      if (!logo) return null;
                      const active =
                        cardBrand === brand || cardBrand === "unknown";
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={brand}
                          src={asset(logo)}
                          alt={cardBrandLabel(brand)}
                          className={`h-5 w-auto object-contain transition ${
                            active ? "opacity-100" : "opacity-25"
                          }`}
                        />
                      );
                    })}
                  </span>
                </label>
                <label className="block">
                  <span className={labelClass}>Expirare</span>
                  <input
                    value={cardExpiry}
                    onChange={(e) =>
                      setCardExpiry(formatCardExpiry(e.target.value))
                    }
                    placeholder="LL/AA"
                    className={fieldClass}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>CVC</span>
                  <input
                    value={cardCvc}
                    onChange={(e) =>
                      setCardCvc(formatCardCvc(e.target.value, cardBrand))
                    }
                    placeholder={cardBrand === "amex" ? "1234" : "123"}
                    className={fieldClass}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                  />
                </label>
              </div>
              {error ? (
                <p className="text-sm font-semibold text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-sm bg-pine px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {busy
                    ? "Se procesează…"
                    : `Plătește acum · ${totalRon} ${travel.currency}`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep("details");
                  }}
                  className="text-sm text-stone underline decoration-dotted"
                >
                  Înapoi la detalii
                </button>
              </div>
            </form>
          )}
        </div>

        {summaryAside}
      </div>
    </div>
  );
}
