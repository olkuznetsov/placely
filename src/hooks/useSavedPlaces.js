import { useState, useCallback } from 'react'

export function useSavedPlaces() {
  const [savedIds, setSavedIds] = useState(new Set([1, 2, 4, 6, 8, 10]))

  const toggleSave = useCallback((placeId) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(placeId)) {
        next.delete(placeId)
      } else {
        next.add(placeId)
      }
      return next
    })
  }, [])

  const isSaved = useCallback((placeId) => savedIds.has(placeId), [savedIds])

  return { savedIds, toggleSave, isSaved }
}
