import type { ResearchResult } from '../types/research'

/**
 * Session-scoped cache: if the same character is searched twice in one
 * browser session, we don't re-hit the Gemini API. Deliberately in-memory
 * (a plain Map) rather than persisted — this matches "cache during the same
 * session" from the spec. It resets on a full page reload, which is fine:
 * the cost we're avoiding is someone re-searching "Batman" five times while
 * browsing, not permanent storage.
 *
 * If you want it to survive reloads too, swap the Map for
 * localStorage.getItem/setItem with JSON.stringify — safe to do in this app
 * since it's a real deployed site, not a sandboxed artifact.
 */
const cache = new Map<string, ResearchResult>()

export function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getCached(query: string): ResearchResult | undefined {
  return cache.get(normalizeQuery(query))
}

export function setCached(query: string, result: ResearchResult): void {
  cache.set(normalizeQuery(query), result)
}

export async function researchCharacter(query: string): Promise<ResearchResult> {
  const key = normalizeQuery(query)
  const hit = cache.get(key)
  if (hit) return hit

  try {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data: ResearchResult = await res.json()
    if (data.status === 'found' || data.status === 'ambiguous' || data.status === 'not_found') {
      cache.set(key, data)
    }
    return data
  } catch {
    return { status: 'error', message: 'Network error reaching the research endpoint.' }
  }
}
