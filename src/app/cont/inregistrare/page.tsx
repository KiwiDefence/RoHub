import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/AuthForms";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Înregistrare · RoHubTravel",
  description: "Creează un cont RoHubTravel pentru rezervarea demo.",
  path: "/cont/inregistrare/",
});

export default function RegisterPage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main-content" className="flex-1 px-5 pb-16 pt-28 sm:px-8">
        <h1 className="mx-auto max-w-md text-center font-display text-3xl font-extrabold text-ink">
          Creează cont
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-stone">
          Email + parolă. Apoi rezervi călătoria demo fără plată.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-center text-stone">Se încarcă…</p>}>
            <RegisterForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
