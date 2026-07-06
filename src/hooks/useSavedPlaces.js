import { useState, useEffect, useCallback } from 'react'

const SAVED_KEY = 'placely.saved.v1'
const VISITED_KEY = 'placely.visited.v1'

function loadSet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set(fallback)
  } catch {
    return new Set(fallback)
  }
}

function persistSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    // storage full / private mode — saves just won't survive reload
  }
}

export function useSavedPlaces() {
  const [savedIds, setSavedIds] = useState(() => loadSet(SAVED_KEY, [1, 2, 4, 6, 8, 10]))
  const [visitedIds, setVisitedIds] = useState(() => loadSet(VISITED_KEY, [4, 8]))

  useEffect(() => persistSet(SAVED_KEY, savedIds), [savedIds])
  useEffect(() => persistSet(VISITED_KEY, visitedIds), [visitedIds])

  const toggleSave = useCallback((placeId) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(placeId) ? next.delete(placeId) : next.add(placeId)
      return next
    })
  }, [])

  const toggleVisited = useCallback((placeId) => {
    setVisitedIds(prev => {
      const next = new Set(prev)
      next.has(placeId) ? next.delete(placeId) : next.add(placeId)
      return next
    })
  }, [])

  const isSaved = useCallback((placeId) => savedIds.has(placeId), [savedIds])
  const isVisited = useCallback((placeId) => visitedIds.has(placeId), [visitedIds])

  return { savedIds, visitedIds, toggleSave, toggleVisited, isSaved, isVisited }
}
