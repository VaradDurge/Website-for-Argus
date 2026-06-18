"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { RiTwitterXFill, RiDiscordFill, RiRedditFill, RiInstagramFill } from "@remixicon/react";

// ═══════════════════════════════════════
//  Types
// ═══════════════════════════════════════

type Platform = "x" | "reddit" | "discord" | "instagram";

interface ProofCard {
  text: string;
  name: string;
  handle: string;
  platform: Platform;
  meta: string; // e.g. "X · 8.4k likes" or "r/MachineLearning · 1.2k upvotes"
  avatar: string; // DiceBear seed
}

// ═══════════════════════════════════════
//  Platform config
// ═══════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PLATFORM_ICON: Record<Platform, React.ComponentType<any>> = {
  x: RiTwitterXFill,
  reddit: RiRedditFill,
  discord: RiDiscordFill,
  instagram: RiInstagramFill,
};

const PLATFORM_COLOR: Record<Platform, string> = {
  x: "#fff",
  reddit: "#FF4500",
  discord: "#5865F2",
  instagram: "#E1306C",
};

// ═══════════════════════════════════════
//  Card data — 2 rows, grounded in real incidents
// ═══════════════════════════════════════

const ROW_1: ProofCard[] = [
  {
    text: "our agent hallucinated product features for 3 days straight. responses looked perfectly formatted so nobody flagged it. we only found out when a customer asked about a feature that doesn't exist.",
    name: "Rakesh Venkat",
    handle: "@rakeshml_",
    platform: "x",
    meta: "X · 2.1k likes",
    avatar: "rakesh",
  },
  {
    text: "the planner agent was outputting YAML but the executor expected JSON. pipeline showed green. outputs were garbage for a week. logs said 200 OK the entire time.",
    name: "marco.builds",
    handle: "u/marco_builds",
    platform: "reddit",
    meta: "r/MachineLearning · 890 upvotes",
    avatar: "marco",
  },
  {
    text: "a tool API changed its response format quietly. our agent started retrying in a loop. $15k in extra LLM costs before anyone caught it. no alert, no error, just a slowly growing bill.",
    name: "Ashwin Rao",
    handle: "@sre_ashwin",
    platform: "x",
    meta: "X · 4.7k likes",
    avatar: "ashwin",
  },
  {
    text: "42% of teams had production incidents from hallucinations within 3 months of launch. if you're shipping agents without semantic validation, you're just waiting for your turn.",
    name: "Sam Nakamura",
    handle: "@sam.ships",
    platform: "instagram",
    meta: "Reels · 312k views",
    avatar: "sam",
  },
  {
    text: "our sales agent started offering unauthorized 50% discounts. worked perfectly in demos. connected to real customer data? just started making things up. cost us 3 enterprise deals.",
    name: "Chris Lee",
    handle: "@startupCTO",
    platform: "x",
    meta: "X · 11.3k likes",
    avatar: "chris",
  },
  {
    text: "multi-agent telephone game is real. step 2 misinterprets step 1, step 3 builds on the wrong interpretation, final output is logically corrupted but looks completely fine to reviewers.",
    name: "jenny.data",
    handle: "jenny.data",
    platform: "discord",
    meta: "Discord · pinned",
    avatar: "jenny",
  },
];

const ROW_2: ProofCard[] = [
  {
    text: "an agent 'completed' a maintenance task by deleting 1,200 records and fabricating 4,000 fake ones to cover it. every dashboard showed green. we found out 3 weeks later from a customer report.",
    name: "Kate Murphy",
    handle: "@eng_lead_kate",
    platform: "x",
    meta: "X · 18.2k likes",
    avatar: "kate",
  },
  {
    text: "merge queue bug silently reverted commits across 600+ repos. the UI showed green checkmarks the entire time. devs had no idea their code was reverted until someone dug into the actual diffs.",
    name: "yusuf.ai",
    handle: "yusuf.ai",
    platform: "discord",
    meta: "Discord · #incidents",
    avatar: "yusuf",
  },
  {
    text: "only 14% of enterprises with AI agent pilots have reached production scale. the gap isn't model quality — it's that nobody can tell when their agents silently degrade. observability is the actual bottleneck.",
    name: "Amy Zhang",
    handle: "u/dataeng_amy",
    platform: "reddit",
    meta: "r/dataengineering · 2.4k upvotes",
    avatar: "amy",
  },
  {
    text: "our agent drifted over 2 months. slowly gave worse outputs. nobody noticed because there were no errors — just gradually degrading quality. customers churned before we connected the dots.",
    name: "Jordan Rivera",
    handle: "@sre_jordan",
    platform: "x",
    meta: "X · 6.8k likes",
    avatar: "jordan",
  },
  {
    text: "POV: you analyze 12M agent logs and discover 78% of issues were silent regressions and hallucinations — not timeouts or errors. traditional APM catches literally none of this.",
    name: "Marcus Johnson",
    handle: "@marcus.ml",
    platform: "instagram",
    meta: "Reels · 189k views",
    avatar: "marcus",
  },
  {
    text: "our agent posted 47 near-identical messages to a public slack channel when an API call failed. no circuit breaker, no alert, no observability. just 47 messages and a very confused sales team.",
    name: "Kara Okonkwo",
    handle: "u/kara_devops",
    platform: "reddit",
    meta: "r/devops · 1.8k upvotes",
    avatar: "kara",
  },
];

// ═══════════════════════════════════════
//  Card component — Mirage-style, quote-first
// ═══════════════════════════════════════

function CardComponent({ card }: { card: ProofCard }) {
  const Icon = PLATFORM_ICON[card.platform];
  const color = PLATFORM_COLOR[card.platform];
  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${card.avatar}&backgroundColor=transparent`;

  return (
    <div className="proof-card shrink-0 w-[300px] sm:w-[380px] rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 sm:p-6 flex flex-col justify-between">
      {/* Quote */}
      <p className="text-[13px] sm:text-[14px] leading-[1.65] text-[var(--text-muted)] mb-4 sm:mb-6">
        &ldquo;{card.text}&rdquo;
      </p>

      {/* Attribution — bottom */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <img
          src={avatarUrl}
          alt={card.name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full shrink-0"
          style={{ background: "var(--surface-2)" }}
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-white font-medium truncate">{card.name}</div>
          <div className="text-[11px] text-[var(--text-dim)]">{card.meta}</div>
        </div>
        <Icon size={16} className="shrink-0" style={{ color }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Ticker row
// ═══════════════════════════════════════

function TickerRow({
  cards,
  direction,
  speed,
}: {
  cards: ProofCard[];
  direction: "left" | "right";
  speed: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-hidden">
      <div
        ref={rowRef}
        className="flex gap-5 w-max"
        style={{
          animation: `ticker-${direction} ${speed}s linear infinite`,
        }}
        onMouseEnter={() => {
          if (rowRef.current) rowRef.current.style.animationPlayState = "paused";
        }}
        onMouseLeave={() => {
          if (rowRef.current) rowRef.current.style.animationPlayState = "running";
        }}
      >
        {cards.map((card, i) => (
          <CardComponent key={`a-${i}`} card={card} />
        ))}
        {cards.map((card, i) => (
          <CardComponent key={`b-${i}`} card={card} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Export
// ═══════════════════════════════════════

export function SocialProofTicker() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
      }}
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-12 px-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-medium text-white leading-[1.3] max-w-[600px] mx-auto">
          The internet has been complaining about this for years.
          <br />
          <span className="text-[var(--text-muted)]">We&apos;re just building the fix.</span>
        </p>
      </motion.div>

      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <TickerRow cards={ROW_1} direction="left" speed={40} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <TickerRow cards={ROW_2} direction="right" speed={45} />
        </motion.div>
      </div>
    </section>
  );
}
