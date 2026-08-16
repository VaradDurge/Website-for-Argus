import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { HeroCradle } from "./components/sections/HeroCradle";
import { SocialProofTicker } from "./components/SocialProofTicker";
import { HowItWorks } from "./components/sections/HowItWorks";
import { FeatureSections } from "./components/sections/FeatureSections";
import { Stats } from "./components/Stats";
import { Testimonial } from "./components/sections/Testimonial";
import { Security } from "./components/sections/Security";
import { Changelog } from "./components/sections/Changelog";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HeroCradle />

        <div className="hairline-t">
          <SocialProofTicker />
        </div>

        <div className="hairline-t">
          <HowItWorks />
        </div>

        <div className="hairline-t">
          <FeatureSections />
        </div>

        <Stats />
        <Testimonial />
        <Security />

        <div className="hairline-t">
          <Changelog />
        </div>

        <div className="hairline-t">
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}
