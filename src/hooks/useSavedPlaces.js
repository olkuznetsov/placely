import { useState, useEffect, useCallback } from 'react'

const SAVED_KEY = 'wishplace.saved.v1'
const VISITED_KEY = 'wishplace.visited.v1'
const SOON_KEY = 'wishplace.soon.v1'

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
  const [soonIds, setSoonIds] = useState(() => loadSet(SOON_KEY, []))

  useEffect(() => persistSet(SAVED_KEY, savedIds), [savedIds])
  useEffect(() => persistSet(VISITED_KEY, visitedIds), [visitedIds])
  useEffect(() => persistSet(SOON_KEY, soonIds), [soonIds])

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

  const markSoon = useCallback((placeId) => {
    setSoonIds(prev => {
      if (prev.has(placeId)) return prev
      const next = new Set(prev)
      next.add(placeId)
      return next
    })
  }, [])

  const isSaved = useCallback((placeId) => savedIds.has(placeId), [savedIds])
  const isVisited = useCallback((placeId) => visitedIds.has(placeId), [visitedIds])
  const isSoon = useCallback((placeId) => soonIds.has(placeId), [soonIds])

  return { savedIds, visitedIds, soonIds, toggleSave, toggleVisited, markSoon, isSaved, isVisited, isSoon }
}
