import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { SocialProofTicker } from "./components/SocialProofTicker";
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
        <SocialProofTicker />
        <Pipeline />
        <Replay />
        <Features />
        <Stats />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
