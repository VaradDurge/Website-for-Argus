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
          background: '#f3f1ea',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* a warm lamp on the paper, as on the site. Literal values: this renders
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
              'linear-gradient(200deg, rgba(214,178,92,0.16) 0%, rgba(214,178,92,0.04) 30%, rgba(243,241,234,0) 55%)',
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
              background: '#141416',
              color: '#e6cf8a',
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
              color: '#4b4b53',
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
              color: '#141416',
              letterSpacing: '-3px',
            }}
          >
            <span>Catch&nbsp;</span>
            <span
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,207,31,0) 52%, rgba(255,207,31,0.62) 52%, rgba(255,207,31,0.62) 94%, rgba(255,207,31,0) 94%)',
              }}
            >
              silent failures
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              fontWeight: 700,
              color: '#141416',
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
            color: '#4b4b53',
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
            color: '#82621a',
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
