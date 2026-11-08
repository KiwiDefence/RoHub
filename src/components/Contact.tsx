"use client";

import { FormEvent, useState } from "react";
import {
  SITE_ADDRESS_DISPLAY,
  SITE_EMAIL,
  SITE_PHONE,
  SITE_PHONE_DISPLAY,
  SITE_WHATSAPP,
} from "@/lib/seo";

type FormState = {
  name: string;
  email: string;
  destination: string;
  message: string;
};

type ContactProps = {
  defaultDestination?: string;
};

const initial: FormState = {
  name: "",
  email: "",
  destination: "",
  message: "",
};

function sanitize(value: string, max = 500) {
  return value.replace(/[<>]/g, "").trim().slice(0, max);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Contact({ defaultDestination = "" }: ContactProps) {
  const [form, setForm] = useState<FormState>({
    ...initial,
    destination: defaultDestination,
  });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSent(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = sanitize(form.name, 80);
    const email = sanitize(form.email, 120);
    const destination = sanitize(form.destination, 120);
    const message = sanitize(form.message, 1000);

    if (name.length < 2) {
      setError("Te rugăm să introduci un nume valid.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Te rugăm să introduci un email valid.");
      return;
    }
    if (message.length < 10) {
      setError("Mesajul trebuie să aibă cel puțin 10 caractere.");
      return;
    }

    const subject = encodeURIComponent(`Cerere RoHubTravel - ${name}`);
    const body = encodeURIComponent(
      [
        `Nume: ${name}`,
        `Email: ${email}`,
        `Destinație dorită: ${destination || "nespecificată"}`,
        "",
        message,
      ].join("\n"),
    );

    window.location.href = `mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    setForm({ ...initial, destination: defaultDestination });
  }

  return (
    <section id="contact" className="bg-mist py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Contact
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Hai să planificăm următorul drum
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
            Spune-ne regiunea din România pe care vrei să o trăiești. Răspundem
            în maximum o zi lucrătoare.
          </p>

          <dl className="mt-10 space-y-5 text-sm sm:text-base">
            <div>
              <dt className="font-semibold text-ink">Email</dt>
              <dd>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="text-moss underline-offset-4 hover:underline"
                >
                  {SITE_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Telefon / WhatsApp</dt>
              <dd className="space-x-3">
                <a
                  href={`tel:${SITE_PHONE}`}
                  className="text-moss underline-offset-4 hover:underline"
                >
                  {SITE_PHONE_DISPLAY}
                </a>
                <a
                  href={`${SITE_WHATSAPP}?text=${encodeURIComponent("Bună ziua, doresc informații despre vacanțele RoHubTravel.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-moss underline-offset-4 hover:underline"
                >
                  WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Sediu</dt>
              <dd className="text-stone">{SITE_ADDRESS_DISPLAY}</dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-pine/20 bg-white p-6 shadow-sm sm:p-8"
          noValidate
          autoComplete="on"
          aria-describedby={error ? "contact-error" : undefined}
        >
          <div className="border-b border-pine/10 pb-5">
            <p className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Formular de contact
            </p>
            <p className="mt-1 text-sm text-stone">
              Completează câmpurile — te contactăm pe email.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {error && (
              <div
                id="contact-error"
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <p className="font-semibold">Verifică formularul:</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-ink"
              >
                Nume
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Numele tău"
                className="mt-2 w-full rounded-md border border-stone/30 bg-fog/40 px-3.5 py-3 text-ink outline-none transition placeholder:text-stone/45 focus:border-pine focus:bg-white focus:ring-2 focus:ring-pine/20"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-ink"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={120}
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="nume@email.com"
                className="mt-2 w-full rounded-md border border-stone/30 bg-fog/40 px-3.5 py-3 text-ink outline-none transition placeholder:text-stone/45 focus:border-pine focus:bg-white focus:ring-2 focus:ring-pine/20"
              />
            </div>

            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-semibold text-ink"
              >
                Destinație / regiune
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                maxLength={120}
                value={form.destination}
                onChange={(e) => update("destination", e.target.value)}
                placeholder="ex. Maramureș, 5 zile"
                className="mt-2 w-full rounded-md border border-stone/30 bg-fog/40 px-3.5 py-3 text-ink outline-none transition placeholder:text-stone/45 focus:border-pine focus:bg-white focus:ring-2 focus:ring-pine/20"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-ink"
              >
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={1000}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Spune-ne perioada, numărul de persoane și ce te interesează…"
                className="mt-2 w-full resize-y rounded-md border border-stone/30 bg-fog/40 px-3.5 py-3 text-ink outline-none transition placeholder:text-stone/45 focus:border-pine focus:bg-white focus:ring-2 focus:ring-pine/20"
              />
            </div>

            {sent ? (
              <p role="status" className="text-sm font-medium text-moss">
                Se deschide clientul de email… Mulțumim!
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-pine px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-pine/25 transition hover:bg-moss sm:w-auto"
            >
              Trimite mesajul
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
