import { ImageResponse } from 'next/og'

export const alt = 'ARGUS — Catch silent failures in AI agents before you deploy'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0e0d0c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* iris key light, as on the site. Literal values: this renders
            through Satori, which does not resolve the stylesheet's custom
            properties. */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 42% 55%, rgba(139,125,255,0.17) 0%, rgba(139,125,255,0.05) 30%, rgba(14,13,12,0) 52%)',
          }}
        />

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
              background: '#f2ede9',
              color: '#0e0d0c',
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
              color: '#a8a09a',
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
              color: '#f2ede9',
              letterSpacing: '-3px',
            }}
          >
            Catch silent failures
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              fontWeight: 700,
              color: '#7d746e',
              letterSpacing: '-3px',
            }}
          >
            before you deploy.
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: '26px',
            color: '#a8a09a',
            lineHeight: 1.5,
            maxWidth: '880px',
          }}
        >
          Your agent finishes, but one node quietly returned nothing. ARGUS finds that node and fails the build before it ships.
        </div>

        {/* Domain */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '20px',
            color: '#7d746e',
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
