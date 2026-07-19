import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ARGUS — Forensic Observability for AI Agent Pipelines'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  ).then((r) => r.text())

  const woff2Url = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1] ?? ''
  const scriptFont = woff2Url ? await fetch(woff2Url).then((r) => r.arrayBuffer()) : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* 16VC Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: '#000000',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '6px',
              letterSpacing: '-0.5px',
            }}
          >
            16VC
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              fontWeight: 600,
              color: '#555555',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Founder Fellow
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '82px', color: '#111111' }}>
            Your Agents Are Failing.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '90px',
              fontFamily: scriptFont ? 'DancingScript' : 'serif',
              fontWeight: 600,
              color: '#666666',
              letterSpacing: '0px',
            }}
          >
            Silently.
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: '26px',
            color: '#777777',
            lineHeight: 1.5,
            maxWidth: '880px',
          }}
        >
          ARGUS detects silent failures, semantic drift, and contract violations in your LangGraph pipelines — before production.
        </div>

        {/* Domain */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '20px',
            color: '#aaaaaa',
            fontWeight: 500,
          }}
        >
          arguslabs.in
        </div>
      </div>
    ),
    {
      ...size,
      ...(scriptFont
        ? {
            fonts: [
              {
                name: 'DancingScript',
                data: scriptFont,
                style: 'normal',
                weight: 600,
              },
            ],
          }
        : {}),
    }
  )
}
