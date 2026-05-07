'use client'

import { useState, useRef, useEffect } from 'react'

const LOADING_LINES = [
  'fetching the README...',
  'reading it with a frown...',
  'finding the worst parts...',
  'consulting the roast oracle...',
  'sharpening the jokes...',
  'almost done destroying you...',
]

export default function Home() {
  const [url, setUrl] = useState('')
  const [roast, setRoast] = useState('')
  const [repo, setRepo] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingLine, setLoadingLine] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (loading) {
      setLoadingLine(0)
      timerRef.current = setInterval(() => {
        setLoadingLine((n) => Math.min(n + 1, LOADING_LINES.length - 1))
      }, 1800)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading])

  async function handleRoast() {
    if (!url.trim() || loading) return
    setLoading(true)
    setError('')
    setRoast('')
    setRepo('')

    try {
      const res = await fetch(`/api/roast?url=${encodeURIComponent(url.trim())}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setRoast(data.roast)
        setRepo(data.repo)
      }
    } catch {
      setError('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  const ogUrl = roast
    ? `/api/og?roast=${encodeURIComponent(roast)}&repo=${encodeURIComponent(repo)}`
    : ''

  const tweetText = roast
    ? `Just got my README roasted 🔥\n\n"${roast.slice(0, 220)}${roast.length > 220 ? '...' : ''}"\n\nroast yours → roastmyreadme.dev`
    : ''

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-4 py-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-5xl" role="img" aria-label="fire">🔥</span>
        <h1 className="text-4xl font-bold tracking-tight font-mono">roast my readme</h1>
      </div>
      <p className="text-zinc-500 font-mono text-sm mb-14 text-center">
        paste a github url. get destroyed.
      </p>

      {/* Input row */}
      <div className="w-full max-w-2xl flex gap-2">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRoast()}
          placeholder="https://github.com/owner/repo"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 font-mono text-sm focus:outline-none focus:border-orange-500 transition-colors"
          autoFocus
        />
        <button
          onClick={handleRoast}
          disabled={!url.trim() || loading}
          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold font-mono px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
        >
          {loading ? 'roasting...' : 'roast it'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-6 text-red-400 font-mono text-sm">{error}</p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-16 flex flex-col items-center gap-4">
          <p key={loadingLine} className="text-zinc-500 font-mono text-sm animate-pulse">
            {LOADING_LINES[loadingLine]}
          </p>
          {/* Progress bar */}
          <div className="w-64 h-px bg-zinc-800 overflow-hidden rounded-full">
            <div
              className="h-full bg-orange-600 transition-all duration-[1800ms] ease-linear"
              style={{ width: `${((loadingLine + 1) / LOADING_LINES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {roast && !loading && (
        <div className="w-full max-w-2xl mt-12">
          <p className="text-zinc-600 font-mono text-xs mb-3">github.com/{repo}</p>

          {/* Roast card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-8 py-6 relative">
            <span className="absolute top-4 left-6 text-orange-500 text-6xl leading-none opacity-30 select-none font-serif">
              &ldquo;
            </span>
            <p className="text-zinc-100 text-lg leading-relaxed italic pt-6">{roast}</p>
          </div>

          {/* Share actions */}
          <div className="mt-4 flex gap-3">
            <a
              href={ogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-sm px-4 py-3 rounded-lg transition-colors"
            >
              view share card
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold font-mono text-sm px-4 py-3 rounded-lg transition-colors"
            >
              tweet this
            </a>
          </div>

          {/* Roast another */}
          <button
            onClick={() => {
              setRoast('')
              setRepo('')
              setUrl('')
              inputRef.current?.focus()
            }}
            className="mt-3 w-full text-center text-zinc-600 hover:text-zinc-400 font-mono text-xs py-2 transition-colors"
          >
            roast another →
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-6 left-0 right-0 text-center text-zinc-800 font-mono text-xs">
        roastmyreadme.dev
      </footer>
    </div>
  )
}
