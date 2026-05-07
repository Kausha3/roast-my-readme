import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const roast = searchParams.get('roast') || 'Your README is on fire.'
  const repo = searchParams.get('repo') || 'unknown/repo'

  // Truncate at a sentence boundary so the card never ends mid-sentence
  function smartTruncate(text: string, max: number): string {
    if (text.length <= max) return text
    const slice = text.slice(0, max)
    const lastSentence = Math.max(
      slice.lastIndexOf('. '),
      slice.lastIndexOf('! '),
      slice.lastIndexOf('? ')
    )
    return lastSentence > max * 0.5
      ? text.slice(0, lastSentence + 1)
      : slice.trimEnd() + '…'
  }

  const truncated = smartTruncate(roast, 420)
  const fontSize = truncated.length > 300 ? 44 : 52

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <span style={{ fontSize: '40px' }}>🔥</span>
          <span
            style={{
              color: '#f97316',
              fontSize: '26px',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            roastmyreadme.dev
          </span>
        </div>

        {/* Quote + text block, centered in remaining space */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              color: '#f97316',
              fontSize: '100px',
              lineHeight: '0.6',
              marginBottom: '20px',
              opacity: 0.4,
              fontFamily: 'serif',
            }}
          >
            &ldquo;
          </div>
          <div
            style={{
              color: '#f4f4f5',
              fontSize: `${fontSize}px`,
              lineHeight: '1.45',
              fontStyle: 'italic',
              fontFamily: 'serif',
            }}
          >
            {truncated}
          </div>
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
