import { SiteNav } from "./components/SiteNav";
import { SmoothScroll } from "./components/SmoothScroll";
import { Hero } from "./components/Hero";
import { WorksWith } from "./components/sections/WorksWith";
import { Problem } from "./components/sections/Problem";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Capabilities } from "./components/sections/Capabilities";
import { Testimonial } from "./components/sections/Testimonial";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/sections/FinalCTA";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteNav />
      <main>
        <Hero />
        <WorksWith />
        <Problem />
        <HowItWorks />
        <Capabilities />
        <Testimonial />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
