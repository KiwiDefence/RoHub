"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiError, getApiBase, setApiBase } from "@/lib/api";

function useNextPath() {
  const params = useSearchParams();
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/calatorie/";
}

function withNext(href: string, next: string) {
  if (next === "/calatorie/") return href;
  return `${href}?next=${encodeURIComponent(next)}`;
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = useNextPath();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      ensureApiHint();
      await login(email.trim(), password);
      router.push(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Autentificare eșuată");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <Field
        label="Parolă"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />
      <ApiHint />
      {error ? <p className="text-sm font-semibold text-red-700" role="alert">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Se conectează…" : "Intră în cont"}
      </button>
      <p className="text-center text-sm text-stone">
        Nu ai cont?{" "}
        <Link
          href={withNext("/cont/inregistrare/", next)}
          className="font-semibold text-pine underline-offset-4 hover:underline"
        >
          Înregistrează-te
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const next = useNextPath();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      ensureApiHint();
      await register(name.trim(), email.trim(), password);
      router.push(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Înregistrare eșuată");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <Field label="Nume" value={name} onChange={setName} autoComplete="name" />
      <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <Field
        label="Parolă (min. 6)"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
      />
      <ApiHint />
      {error ? <p className="text-sm font-semibold text-red-700" role="alert">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Se creează…" : "Creează cont"}
      </button>
      <p className="text-center text-sm text-stone">
        Ai deja cont?{" "}
        <Link
          href={withNext("/cont/autentificare/", next)}
          className="font-semibold text-pine underline-offset-4 hover:underline"
        >
          Autentifică-te
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="mt-1.5 w-full rounded-md border border-stone/30 bg-white px-3.5 py-3 text-ink outline-none focus:border-pine focus:ring-2 focus:ring-pine/20"
      />
    </label>
  );
}

function ensureApiHint() {
  if (!getApiBase() && process.env.NEXT_PUBLIC_PITICOT_API) {
    setApiBase(process.env.NEXT_PUBLIC_PITICOT_API);
  }
}

function ApiHint() {
  const [base, setBase] = useState(() =>
    typeof window !== "undefined" ? getApiBase() : "",
  );

  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone">
        Server (LAN)
      </span>
      <input
        value={base}
        onChange={(e) => {
          setBase(e.target.value);
          setApiBase(e.target.value);
        }}
        placeholder="http://192.168.x.x:4000"
        className="mt-1.5 w-full rounded-md border border-dashed border-stone/30 bg-fog/40 px-3.5 py-2 text-sm text-ink outline-none focus:border-pine"
      />
    </label>
  );
}
