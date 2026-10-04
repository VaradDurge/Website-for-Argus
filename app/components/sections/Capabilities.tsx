import { Container } from "@/components/ui/section";
import { Spotlight } from "../Spotlight";

/* Every vignette is real: the consumers= API, the section headings argus fix
   writes (src/argus/fix_prompt.py), replay's frozen-upstream mode, and the
   three BYOK providers. */

export function Capabilities() {
  return (
    <section className="relative py-24 md:py-36">
      <Container>
        <div className="reveal mx-auto flex max-w-[40rem] flex-col items-center text-center">
          <p className="kicker">Built for how agents break</p>
          <h2 className="display-2 text-sheen mt-6">Less digging. More shipping.</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-clip rounded-[var(--radius-block)] mx-auto max-w-[64rem] bg-[var(--line)] shadow-[0_0_0_1px_var(--line)] md:mt-20 md:grid-cols-2">
          <Cell
            title="Field contracts"
            body={
              <>
                Declare who reads what. A field that&rsquo;s never written,
                written empty or dropped fails on the node responsible, not on
                the one that tripped over it.
              </>
            }
          >
            <Code>
              <Ln>
                <K>ArgusRecorder</K>(consumers={"{"}
              </Ln>
              <Ln indent>
                <S>&quot;merged_summaries&quot;</S>: [<S>&quot;synthesize_report&quot;</S>],
              </Ln>
              <Ln>{"}"}).attach(graph)</Ln>
            </Code>
          </Cell>

          <Cell
            title="A fix prompt, not a stack trace"
            body={
              <>
                <code>argus fix</code> writes a paste-ready prompt for Claude
                Code, Cursor or any coding agent. It targets the origin, cites
                the source line and runs offline.
              </>
            }
          >
            <Code>
              <Ln dim>$ argus fix last</Ln>
              <Ln>
                <B>Edit this file:</B> nodes.py — <K>merge_summaries</K>
              </Ln>
              <Ln dim>## Why this file and not the crash site</Ln>
              <Ln>
                <B>Do not edit</B> <span className="text-[var(--sig-fail)]">synthesize_report</span>.
              </Ln>
            </Code>
          </Cell>

          <Cell
            title="Replay without the rerun"
            body={
              <>
                Rerun from the node you fixed. Everything upstream comes from the
                recording, so the LLM calls before it don&rsquo;t run, or bill,
                again.
              </>
            }
          >
            <ReplayStrip />
          </Cell>

          <Cell
            title="Local-first. Your keys."
            body={
              <>
                Runs are written to <code>.argus/</code> in your project. The LLM
                judge uses your own key, and with none, ARGUS falls back to
                heuristics.
              </>
            }
          >
            <div className="flex flex-col gap-4">
              <Code>
                <Ln dim>$ argus key set --provider anthropic</Ln>
              </Code>
              <ul className="flex flex-wrap gap-2">
                {["OpenAI", "Anthropic", "Gemini", "No key · heuristics"].map((p) => (
                  <li
                    key={p}
                    className="rounded-full px-3 py-1 font-mono text-[11.5px] text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--line-2)]"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Cell>
        </div>
      </Container>
    </section>
  );
}

function Cell({
  title,
  body,
  children,
}: {
  title: string;
  body: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Spotlight className="reveal flex flex-col gap-10 bg-[var(--void)] p-7 sm:p-9">
      <div className="min-h-[6.5rem]">{children}</div>
      <div>
        <h3 className="text-[17px] font-medium tracking-[-0.02em] text-[var(--ink)]">{title}</h3>
        <p className="ident mt-2.5 max-w-[30rem] text-pretty text-[14.5px] leading-[1.6] text-[var(--ink-2)]">{body}</p>
      </div>
    </Spotlight>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto font-mono text-[12.5px] leading-[1.85] text-[var(--ink-2)] sm:text-[13px]">
      {children}
    </div>
  );
}

function Ln({ children, indent, dim }: { children: React.ReactNode; indent?: boolean; dim?: boolean }) {
  return (
    <div className={`whitespace-pre ${indent ? "pl-[4ch]" : ""} ${dim ? "text-[var(--ink-3)]" : ""}`}>
      {children}
    </div>
  );
}

const K = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--ink)]">{children}</span>
);
const S = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--sig-ok)]">{children}</span>
);
const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-[var(--ink)]">{children}</span>
);

/** Upstream frozen (hatched), merge onward rerun (green). */
function ReplayStrip() {
  const nodes = [
    { x: 16, frozen: true },
    { x: 86, frozen: true },
    { x: 156, frozen: true },
    { x: 226, frozen: false },
    { x: 296, frozen: false },
  ];
  return (
    <div>
      <svg viewBox="0 0 312 70" className="h-auto w-full max-w-[22rem]" aria-hidden>
        <defs>
          <pattern id="cap-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink-3)" strokeWidth="1.6" />
          </pattern>
        </defs>
        <path d="M 6 2 L 6 -4 L 166 -4 L 166 2" transform="translate(0 16)" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
        <line x1="16" y1="44" x2="226" y2="44" stroke="var(--line-3)" strokeWidth="2" />
        <line x1="226" y1="44" x2="296" y2="44" stroke="var(--sig-ok)" strokeWidth="2.4" />
        {nodes.map((n) => (
          <circle
            key={n.x}
            cx={n.x}
            cy={44}
            r={7.5}
            fill={n.frozen ? "url(#cap-hatch)" : "var(--void)"}
            stroke={n.frozen ? "var(--ink-3)" : "var(--sig-ok)"}
            strokeWidth={1.8}
          />
        ))}
        <circle cx={226} cy={44} r={3} fill="var(--sig-ok)" />
        <circle cx={296} cy={44} r={3} fill="var(--sig-ok)" />
      </svg>
      <div className="mt-1 flex max-w-[22rem] justify-between font-mono text-[11px] text-[var(--ink-3)]">
        <span>recorded outputs reused</span>
        <span className="text-[var(--sig-ok)]">rerun</span>
      </div>
    </div>
  );
}
