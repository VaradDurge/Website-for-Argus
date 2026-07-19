import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ARGUS — Forensic Observability for AI Agent Pipelines'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
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
            lineHeight: 1.1,
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              fontWeight: 700,
              color: '#111111',
              letterSpacing: '-3px',
            }}
          >
            Your Agents Are Failing.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#555555',
              letterSpacing: '-3px',
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
    { ...size }
  )
}
