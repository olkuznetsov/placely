import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { places as mockPlaces } from '../data/mockData'

const KEY = 'wishplace.myplaces.v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const PlacesContext = createContext(null)

/** Mock places + the user's own OSM-added places, merged for every page. */
export function PlacesProvider({ children }) {
  const [myPlaces, setMyPlaces] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(myPlaces)) } catch { /* fine */ }
  }, [myPlaces])

  const value = useMemo(() => {
    const allPlaces = [...myPlaces, ...mockPlaces]
    const addPlace = (place) => {
      setMyPlaces(prev => (prev.some(p => p.id === place.id) ? prev : [place, ...prev]))
    }
    const removePlace = (id) => setMyPlaces(prev => prev.filter(p => p.id !== id))
    return { allPlaces, myPlaces, addPlace, removePlace }
  }, [myPlaces])

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
}

export function usePlaces() {
  const ctx = useContext(PlacesContext)
  if (!ctx) throw new Error('usePlaces must be used within PlacesProvider')
  return ctx
}
