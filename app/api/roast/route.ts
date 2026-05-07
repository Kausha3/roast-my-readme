import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 60

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url.trim())
    if (!parsed.hostname.includes('github.com')) return null
    const parts = parsed.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null
    return { owner: parts[0], repo: parts[1] }
  } catch {
    return null
  }
}

async function fetchReadme(owner: string, repo: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    { headers: { Accept: 'application/vnd.github.raw+json' } }
  )
  if (!res.ok) throw new Error('README not found')
  return res.text()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  const parsed = parseGitHubUrl(url)
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 })
  }

  let readme: string
  try {
    readme = await fetchReadme(parsed.owner, parsed.repo)
  } catch {
    return NextResponse.json(
      { error: 'Could not fetch README — is the repo public?' },
      { status: 404 }
    )
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const truncated = readme.slice(0, 8000)

  const prompt = `You are a brutally honest but genuinely funny comedy writer roasting software projects based on their READMEs.

Here's the README for "${parsed.owner}/${parsed.repo}":

---
${truncated}
---

Write a roast of this README like a stand-up comedian who just read it backstage and cannot believe what they're about to present. Rules:
- Quote specific lines from the README (use quotation marks around actual quoted text)
- Be funny first, mean second — the goal is laughs, not cruelty
- Call out what's unclear, overhyped, or hilariously mundane
- 4-6 sentences, one flowing paragraph, no bullet points or headers
- End with a killer punchline
- Do NOT start with "I" or "This README"
- Do NOT use markdown formatting

Respond with only the roast text, nothing else.`

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Roast timed out — try again')), 25000)
    )
    const result = await Promise.race([model.generateContent(prompt), timeout])
    const roast = result.response.text().trim()
    if (!roast) {
      return NextResponse.json({ error: 'AI returned an empty roast — try again' }, { status: 502 })
    }
    return NextResponse.json({ roast, repo: `${parsed.owner}/${parsed.repo}` })
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    const isTimeout = message.includes('timed out')
    const isQuota = message.includes('429') || message.toLowerCase().includes('quota')
    const clientError = isTimeout
      ? 'Roast timed out — try again'
      : isQuota
      ? 'Too many requests — try again in a moment'
      : 'AI generation failed — try again'
    return NextResponse.json({ error: clientError }, { status: 502 })
  }
}
