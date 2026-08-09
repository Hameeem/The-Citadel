import { useState, useEffect } from 'react'
import type { Character } from '../types/character'
import { characters as defaultCharacters } from '../data/characters'

const STORAGE_CUSTOM_KEY = 'citadel_custom_characters'
const STORAGE_OVERRIDES_KEY = 'citadel_image_overrides'
const STORAGE_FAVORITES_KEY = 'citadel_favorites'
const STORAGE_VOTES_KEY = 'citadel_matchup_votes'

/** Retrieve image overrides map from localStorage */
export function getImageOverrides(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Update a character's image URL (e.g. from Pinterest or custom selection) */
export function setCharacterImageOverride(characterId: string, imageUrl: string): void {
  if (typeof window === 'undefined') return
  try {
    const overrides = getImageOverrides()
    overrides[characterId] = imageUrl
    localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(overrides))
    window.dispatchEvent(new Event('citadel_characters_updated'))
  } catch (err) {
    console.error('Failed to save image override:', err)
  }
}

/** Retrieve custom imported characters from localStorage */
export function getStoredCustomCharacters(): Character[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/** Save an imported character (e.g. from MyAnimeList, Wikipedia, or Pinterest) into local storage */
export function saveCustomCharacter(character: Character): void {
  if (typeof window === 'undefined') return
  try {
    const current = getStoredCustomCharacters().filter((c) => c.id !== character.id)
    const updated = [character, ...current]
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('citadel_characters_updated'))
  } catch (err) {
    console.error('Failed to save custom character:', err)
  }
}

/** Remove custom character */
export function removeCustomCharacter(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const current = getStoredCustomCharacters().filter((c) => c.id !== id)
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(current))
    window.dispatchEvent(new Event('citadel_characters_updated'))
  } catch (err) {
    console.error('Failed to remove custom character:', err)
  }
}

/** Get all characters combined (curated + custom imported, with active image overrides) */
export function getAllCharacters(): Character[] {
  const overrides = getImageOverrides()
  const custom = getStoredCustomCharacters()
  const customMap = new Map(custom.map((c) => [c.id, c]))

  const combined: Character[] = [...custom]
  for (const c of defaultCharacters) {
    if (!customMap.has(c.id)) {
      combined.push(c)
    }
  }

  // Apply image overrides
  return combined.map((c) => {
    if (overrides[c.id]) {
      return { ...c, imageUrl: overrides[c.id] }
    }
    return c
  })
}

/** React hook for live reactive character list */
export function useAllCharacters(): {
  characters: Character[]
  addCharacter: (c: Character) => void
  removeCharacter: (id: string) => void
  updateCharacterImage: (id: string, imageUrl: string) => void
} {
  const [list, setList] = useState<Character[]>(getAllCharacters)

  useEffect(() => {
    const handleUpdate = () => {
      setList(getAllCharacters())
    }
    window.addEventListener('citadel_characters_updated', handleUpdate)
    return () => window.removeEventListener('citadel_characters_updated', handleUpdate)
  }, [])

  return {
    characters: list,
    addCharacter: saveCustomCharacter,
    removeCharacter: removeCustomCharacter,
    updateCharacterImage: setCharacterImageOverride,
  }
}

/** Community votes storage for matchups */
export function getMatchupVotes(): Record<string, { a: number; b: number; userVoted?: 'a' | 'b' }> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_VOTES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function voteMatchup(matchupKey: string, side: 'a' | 'b'): { a: number; b: number; userVoted: 'a' | 'b' } {
  const votes = getMatchupVotes()
  const current = votes[matchupKey] || { a: 120, b: 95 }
  if (current.userVoted) return { ...current, userVoted: current.userVoted }

  const updated = {
    a: current.a + (side === 'a' ? 1 : 0),
    b: current.b + (side === 'b' ? 1 : 0),
    userVoted: side,
  }
  votes[matchupKey] = updated
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_VOTES_KEY, JSON.stringify(votes))
  }
  return updated
}
