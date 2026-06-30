"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

type FeatureValue =
  | { type: "check" }
  | { type: "dash" }
  | { type: "text"; label: string }
  | { type: "soon" };

interface Feature {
  name: string;
  value: FeatureValue;
}

interface Tier {
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  period: string;
  badge?: string;
  features: Feature[];
  cta: string;
  highlighted?: boolean;
  comingSoon?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    subtitle: "For solo devs exploring ARGUS",
    price: "$0",
    period: "forever free",
    features: [
      { name: "Runs monitored", value: { type: "text", label: "100/month" } },
      { name: "Run history retention", value: { type: "text", label: "7 days" } },
      { name: "Silent failure detection", value: { type: "check" } },
      { name: "Root cause analysis", value: { type: "check" } },
      { name: "Cloud sync", value: { type: "dash" } },
      { name: "Replay engine", value: { type: "text", label: "5 replays/mo" } },
      { name: "LLM comparison (auto-diff)", value: { type: "dash" } },
      { name: "Send Report to Linear", value: { type: "dash" } },
      { name: "Team members", value: { type: "text", label: "1" } },
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    subtitle: "For teams shipping AI to production",
    price: "$0",
    originalPrice: "$29",
    period: "/mo",
    badge: "Free during beta",
    highlighted: true,
    features: [
      { name: "Runs monitored", value: { type: "text", label: "Unlimited" } },
      { name: "Run history retention", value: { type: "text", label: "90 days" } },
      { name: "Silent failure detection", value: { type: "check" } },
      { name: "Root cause analysis", value: { type: "check" } },
      { name: "CLI + Dashboard", value: { type: "check" } },
      { name: "Semantic signatures", value: { type: "text", label: "Built-in + custom" } },
      { name: "Cloud sync", value: { type: "check" } },
      { name: "Replay engine", value: { type: "text", label: "Unlimited" } },
      { name: "LLM comparison (auto-diff)", value: { type: "check" } },
      { name: "HTTP recording/playback", value: { type: "check" } },
      { name: "Send Report to Linear/Slack", value: { type: "check" } },
      { name: "Priority support", value: { type: "text", label: "Discord channel" } },
      { name: "Team members", value: { type: "text", label: "Up to 5" } },
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    subtitle: "For orgs that need control",
    price: "Custom",
    period: "",
    comingSoon: true,
    features: [
      { name: "Everything in Pro", value: { type: "check" } },
      { name: "SSO / SAML", value: { type: "soon" } },
      { name: "Audit logs", value: { type: "soon" } },
      { name: "Self-hosted option", value: { type: "soon" } },
      { name: "Custom integrations", value: { type: "soon" } },
      { name: "SLA guarantee", value: { type: "soon" } },
      { name: "Unlimited team members", value: { type: "soon" } },
      { name: "Dedicated support", value: { type: "soon" } },
    ],
    cta: "Contact Us",
  },
];

function FeatureValueDisplay({ value }: { value: FeatureValue }) {
  switch (value.type) {
    case "check":
      return <Check size={14} strokeWidth={2} className="text-[var(--signal-ok)]" />;
    case "dash":
      return <Minus size={14} strokeWidth={2} className="text-[var(--text-dim)]" />;
    case "text":
      return (
        <span className="text-[12.5px] font-mono text-[var(--text-muted)]">
          {value.label}
        </span>
      );
    case "soon":
      return (
        <span className="text-[11px] font-mono tracking-[0.08em] uppercase text-[var(--signal-warn)] opacity-70">
          Soon
        </span>
      );
  }
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 lg:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow inline-block"
          >
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 text-[38px] sm:text-[46px] lg:text-[52px] leading-[1.05] tracking-[-0.03em] font-medium"
          >
            Start free.{" "}
            <span className="font-serif-italic text-[var(--accent-soft)]">
              Scale when ready.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-[15px] text-[var(--text-muted)] max-w-md mx-auto"
          >
            Everything is free during the beta. No credit card required.
          </motion.p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-start">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* "Most Popular" floating badge for Pro */}
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-[0.1em] uppercase bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(109,92,255,0.4)]">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className="panel flex flex-col h-full p-6 lg:p-7"
                style={
                  tier.highlighted
                    ? {
                        borderColor: "var(--accent)",
                        boxShadow:
                          "0 0 0 1px var(--accent), 0 0 40px -10px rgba(109, 92, 255, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.8)",
                      }
                    : undefined
                }
              >
                {/* Tier header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[18px] font-semibold tracking-[-0.01em]">
                      {tier.name}
                    </h3>
                    {tier.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[var(--signal-ok)]/30 bg-[rgba(0,240,168,0.06)]">
                        <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--signal-ok)]">
                          {tier.badge}
                        </span>
                      </span>
                    )}
                    {tier.comingSoon && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.06)]">
                        <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--signal-warn)]">
                          Coming Soon
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] text-[var(--text-dim)]">
                    {tier.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mt-5 flex items-baseline gap-2">
                    {tier.originalPrice && (
                      <span className="text-[22px] font-medium text-[var(--text-dim)] line-through decoration-[var(--signal-fail)]">
                        {tier.originalPrice}
                      </span>
                    )}
                    <span className="text-[40px] font-bold tracking-[-0.03em] leading-none">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-[14px] text-[var(--text-dim)]">
                        {tier.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--border)] mb-5" />

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li
                      key={feature.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-[13px] text-[var(--text-muted)]">
                        {feature.name}
                      </span>
                      <span className="shrink-0">
                        <FeatureValueDisplay value={feature.value} />
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={
                    tier.highlighted ? "btn-primary w-full justify-center" : "btn-ghost w-full justify-center"
                  }
                >
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
