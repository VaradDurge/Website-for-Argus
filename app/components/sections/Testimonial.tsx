import { RiMediumFill, RiTwitterXFill } from "@remixicon/react";
import { Container } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/* Exact public wording only, from testimonials.md (20 Nov 2026). Private
   DMs, bot accounts, and paraphrases stay off until their authors say yes. */
type Quote = {
  name: string;
  handle: string;
  platform: "x" | "medium";
  href: string;
  text: string;
};

const TOP: Quote[] = [
  {
    name: "Sara Nambiar",
    handle: "@sara_nambiar",
    platform: "x",
    href: "https://x.com/sara_nambiar/status/2069336632101421392",
    text: "literally need of the hour, so excited to use this!!\ni remember back when claude code had shipped a bad version and users didn’t know whether it was the model or the coding harness\nsomething like ARGUS can definitely help us catch where agents fail to provide the outcome we need",
  },
  {
    name: "Ritish",
    handle: "@KurmaRitish",
    platform: "x",
    href: "https://x.com/KurmaRitish/status/2112387603110461490",
    text: "Exactly. In CodeMigrator each node validates the next one's input shape - field count plus required keys. A quiet drop gets caught at the gate, not two hops downstream when the migrated program miscompiles. Love the ARGUS work for catching those silent failures.",
  },
  {
    name: "Karthik Naidu",
    handle: "@DTXNaidu",
    platform: "x",
    href: "https://x.com/DTXNaidu/status/2107472050528956662",
    text: "Crashes get fixed in one incident. The green-summary-wrong-run is the expensive one because it keeps happening quietly until someone audits it. Your ARGUS framing — catching it before users do — is the right side of that line.",
  },
  {
    name: "Martin Szreter",
    handle: "@MartinSzreter",
    platform: "x",
    href: "https://x.com/MartinSzreter/status/2099076896180863263",
    text: "Self-agreement bias is the real trap. Argus looks interesting - the root-cause graphing is the hard part. Will take a look.",
  },
  {
    name: "Andrew",
    handle: "@AndreyK09474778",
    platform: "x",
    href: "https://x.com/AndreyK09474778/status/2100159842522386493",
    text: "Silent fails with no error are the worst — you chase ghosts. Argus sounds like exactly the kind of thing I'd want running under my own pipelines.",
  },
  {
    name: "Kizuno18",
    handle: "@Kizuno18",
    platform: "x",
    href: "https://x.com/Kizuno18/status/2101910711861412144",
    text: "silent failures are the silent killer in agent pipelines. a node returns 200 OK with hallucinated fields, the downstream worker accepts it, and 4 steps later ffmpeg segfaults. checking out Argus—graph root cause detection is exactly what production harnesses need",
  },
];

const BOTTOM: Quote[] = [
  {
    name: "ivzhukau",
    handle: "@ivzhukau",
    platform: "x",
    href: "https://x.com/ivzhukau/status/2121499038537413002",
    text: "The ignored-pagination check in ARGUS is a good example: every tool call can succeed and the conclusion can still be based on half the data.",
  },
  {
    name: "Kelv.in",
    handle: "@0XKellll",
    platform: "x",
    href: "https://x.com/0XKellll/status/2069324020894572748",
    text: "Nice wedge. The 4-layer detector + replay bit is the useful part imo.",
  },
  {
    name: "Arsal Khan",
    handle: "@arsalkhan501160",
    platform: "medium",
    href: "https://medium.com/@varaddurge/someone-finally-asked-what-argus-actually-checks-8eab965b1493",
    text: "The example where a failed data pull still handed off \"done\" is concrete and easy to overlook.",
  },
  {
    name: "Aapakari",
    handle: "@aapakari",
    platform: "x",
    href: "https://x.com/aapakari/status/2119006919486579109",
    text: "ARGUS sounds like it was built for exactly that failure mode.",
  },
  {
    name: "Demir",
    handle: "@demirbuilds",
    platform: "x",
    href: "https://x.com/demirbuilds/status/2069321466869395954",
    text: "This is a painful bug class that’s way more common than people realize in AI pipelines.",
  },
  {
    name: "NeonNode",
    handle: "@neon_node_",
    platform: "x",
    href: "https://x.com/neon_node_/status/2062223376018715108",
    text: "this one demands a full article on how Argus could be the next game changer",
  },
];

const PLATFORM = {
  x: { Icon: RiTwitterXFill, label: "X" },
  medium: { Icon: RiMediumFill, label: "Medium" },
} as const;

function Card({ quote, copy }: { quote: Quote; copy: boolean }) {
  const { Icon, label } = PLATFORM[quote.platform];
  return (
    <li className="w-[340px] shrink-0 px-2.5 sm:w-[380px]">
      <a
        href={quote.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={copy ? -1 : undefined}
        className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-block)] bg-[var(--raised)] p-6 shadow-[inset_0_0_0_1px_var(--line)] transition-shadow duration-300 hover:shadow-[inset_0_0_0_1.5px_var(--iris)]"
      >
        <p className="whitespace-pre-line text-[15px] leading-[1.55] text-[var(--ink)]">&ldquo;{quote.text}&rdquo;</p>
        <div className="flex items-center justify-between gap-3 text-[13px]">
          <span className="min-w-0 truncate">
            <span className="font-medium text-[var(--ink)]">{quote.name}</span>
            <span className="ml-2 font-mono text-[12px] text-[var(--ink-3)]">{quote.handle}</span>
          </span>
          <Icon size={15} aria-label={`On ${label}`} className="shrink-0 text-[var(--ink-3)]" />
        </div>
      </a>
    </li>
  );
}

/** Two copies end to end for the loop; the second is hidden from AT and tab order. */
function Row({ quotes, reverse = false }: { quotes: Quote[]; reverse?: boolean }) {
  return (
    <div className="marquee-mask overflow-hidden">
      <div className={cn("marquee", reverse && "marquee-reverse")}>
        {[false, true].map((copy) => (
          <ul key={String(copy)} aria-hidden={copy || undefined} className="flex shrink-0 items-stretch">
            {quotes.map((quote) => (
              <Card key={quote.href} quote={quote} copy={copy} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Testimonial() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="reveal mx-auto flex max-w-[40rem] flex-col items-center text-center">
          <p className="kicker">From builders</p>
          <h2 className="display-2 text-sheen mt-6">What engineers are saying.</h2>
        </div>
      </Container>
      <div className="mt-14 flex flex-col gap-5 md:mt-20">
        <Row quotes={TOP} />
        <Row quotes={BOTTOM} reverse />
      </div>
    </section>
  );
}
