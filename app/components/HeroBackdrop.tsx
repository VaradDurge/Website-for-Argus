/**
 * Decorative hero backdrop: a field of scattered characters over the
 * layered dome gradients defined by `.hero-atmos`.
 *
 * The characters are generated from a fixed seed rather than Math.random
 * so server and client produce identical markup. A tiled SVG pattern was
 * tried first and read as wallpaper — the repeat was obvious across the
 * width, so the rows are emitted individually instead.
 */

const CHARS = "0123456789XABF";

const ROWS = 30;
const CHUNKS_PER_ROW = 7;
const CHARS_PER_CHUNK = 11;

/** Small deterministic PRNG, so the field is stable across renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function HeroBackdrop() {
  const rand = mulberry32(20260820);

  const rows = Array.from({ length: ROWS }, () =>
    Array.from({ length: CHUNKS_PER_ROW }, () => {
      let text = "";
      for (let i = 0; i < CHARS_PER_CHUNK; i += 1) {
        text += CHARS[Math.floor(rand() * CHARS.length)];
      }
      return {
        // spaced out so the field reads as a loose grid, not solid text
        text: text.split("").join(" "),
        opacity: 0.3 + rand() * 0.7,
        indent: rand() * 3.5,
      };
    })
  );

  return (
    <div aria-hidden className="hero-atmos">
      <div className="hero-atmos__digits">
        {rows.map((chunks, rowIndex) => (
          <div key={rowIndex} className="hero-atmos__row">
            {chunks.map((chunk, chunkIndex) => (
              <span
                key={chunkIndex}
                style={{
                  opacity: chunk.opacity,
                  marginLeft: `${chunk.indent}em`,
                }}
              >
                {chunk.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
