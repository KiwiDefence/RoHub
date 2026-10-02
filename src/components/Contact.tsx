"use client";

import { FormEvent, useState } from "react";

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

    const subject = encodeURIComponent(`Cerere RoHubTravel — ${name}`);
    const body = encodeURIComponent(
      [
        `Nume: ${name}`,
        `Email: ${email}`,
        `Destinație dorită: ${destination || "nespecificată"}`,
        "",
        message,
      ].join("\n"),
    );

    window.location.href = `mailto:hello@rohub.ro?subject=${subject}&body=${body}`;
    setSent(true);
    setForm({ ...initial, destination: defaultDestination });
  }

  return (
    <section id="contact" className="bg-mist py-20 sm:py-28">
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
            în maxim o zi lucrătoare.
          </p>

          <dl className="mt-10 space-y-5 text-sm sm:text-base">
            <div>
              <dt className="font-semibold text-ink">Email</dt>
              <dd>
                <a
                  href="mailto:hello@rohub.ro"
                  className="text-moss underline-offset-4 hover:underline"
                >
                  hello@rohub.ro
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Telefon</dt>
              <dd>
                <a
                  href="tel:+40722111222"
                  className="text-moss underline-offset-4 hover:underline"
                >
                  +40 722 111 222
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Sediu</dt>
              <dd className="text-stone">București, România</dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5"
          noValidate
          autoComplete="on"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink">
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
              className="mt-2 w-full border-0 border-b border-stone/30 bg-transparent px-0 py-3 text-ink outline-none transition focus:border-pine"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink"
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
              className="mt-2 w-full border-0 border-b border-stone/30 bg-transparent px-0 py-3 text-ink outline-none transition focus:border-pine"
            />
          </div>

          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-ink"
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
              className="mt-2 w-full border-0 border-b border-stone/30 bg-transparent px-0 py-3 text-ink outline-none transition placeholder:text-stone/50 focus:border-pine"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-ink"
            >
              Mesaj
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              maxLength={1000}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="mt-2 w-full resize-y border-0 border-b border-stone/30 bg-transparent px-0 py-3 text-ink outline-none transition focus:border-pine"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}
          {sent ? (
            <p role="status" className="text-sm font-medium text-moss">
              Se deschide clientul de email… Mulțumim!
            </p>
          ) : null}

          <button
            type="submit"
            className="rounded-sm bg-pine px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss"
          >
            Trimite mesajul
          </button>
        </form>
      </div>
    </section>
  );
}
