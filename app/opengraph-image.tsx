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
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '1100px',
            height: '530px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 72px',
            position: 'relative',
          }}
        >
          {/* 16VC Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '36px',
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
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', fontSize: '80px', color: '#111111' }}>
              Your Agents Are Failing.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '88px',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: '#aaaaaa',
                  letterSpacing: '2px',
                }}
              >
                Silently.
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              fontSize: '26px',
              color: '#666666',
              lineHeight: 1.5,
              maxWidth: '860px',
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
              right: '72px',
              fontSize: '20px',
              color: '#999999',
              fontWeight: 500,
            }}
          >
            arguslabs.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
