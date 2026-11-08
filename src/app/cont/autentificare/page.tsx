import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/AuthForms";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Autentificare · RoHubTravel",
  description: "Intră în contul RoHubTravel.",
  path: "/cont/autentificare/",
});

export default function LoginPage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main-content" className="flex-1 px-5 pb-16 pt-28 sm:px-8">
        <h1 className="mx-auto max-w-md text-center font-display text-3xl font-extrabold text-ink">
          Autentificare
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-stone">
          Intră ca să vezi călătoria și Piticotul.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-center text-stone">Se încarcă…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
