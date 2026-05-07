import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const roast = searchParams.get('roast') || 'Your README is on fire.'
  const repo = searchParams.get('repo') || 'unknown/repo'

  const truncated = roast.length > 260 ? roast.slice(0, 257) + '...' : roast

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '1200px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          padding: '80px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
          <span style={{ fontSize: '44px' }}>🔥</span>
          <span
            style={{
              color: '#f97316',
              fontSize: '28px',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            roastmyreadme.dev
          </span>
        </div>

        {/* Opening quote */}
        <div
          style={{
            color: '#f97316',
            fontSize: '140px',
            lineHeight: '0.6',
            marginBottom: '24px',
            opacity: 0.35,
            fontFamily: 'serif',
          }}
        >
          &ldquo;
        </div>

        {/* Roast text */}
        <div
          style={{
            color: '#f4f4f5',
            fontSize: '54px',
            lineHeight: '1.38',
            fontStyle: 'italic',
            fontFamily: 'serif',
            flex: 1,
          }}
        >
          {truncated}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #27272a',
            paddingTop: '32px',
          }}
        >
          <span style={{ color: '#52525b', fontSize: '26px', fontFamily: 'monospace' }}>
            github.com/{repo}
          </span>
          <span style={{ color: '#3f3f46', fontSize: '22px', fontFamily: 'monospace' }}>
            roastmyreadme.dev
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1200,
    }
  )
}
