import { Nav } from "../components/Nav";
import { Pricing } from "../components/Pricing";
import { Footer } from "../components/Footer";

export const metadata = {
  title: "Pricing — ARGUS",
  description:
    "Simple, transparent pricing for ARGUS. Free during beta — no credit card required.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
