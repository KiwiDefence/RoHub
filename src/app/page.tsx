import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Destinations } from "@/components/Destinations";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Destinations />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
