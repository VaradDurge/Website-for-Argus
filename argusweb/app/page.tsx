import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { GetStarted } from "./components/GetStarted";
import { Pipeline } from "./components/Pipeline";
import { Replay } from "./components/Replay";
import { Features } from "./components/Features";
import { Stats } from "./components/Stats";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Divider label="01 · Get Started" />
        <GetStarted />
        <Divider label="02 · Pipeline" />
        <Pipeline />
        <Divider label="03 · Replay" />
        <Replay />
        <Divider label="04 · Features" />
        <Features />
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="divider" />
        </div>
        <Stats />
        <Divider label="05 · FAQ" />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--text-dim)]">
          {label}
        </span>
        <div className="flex-1 divider" />
      </div>
    </div>
  );
}
