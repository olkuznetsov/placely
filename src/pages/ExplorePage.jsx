import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Search, Filter, List, Map as MapIcon, Star, Heart, MapPin, Navigation } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import CategoryFilter from '../components/CategoryFilter'
import PlaceDetail from '../components/PlaceDetail'
import { places } from '../data/mockData'

function createMarkerIcon(category) {
  const colors = {
    restaurant: '#FF6B6B',
    cafe: '#FFB830',
    bar: '#B088F9',
    park: '#6BCB77',
    museum: '#4D96FF',
    bakery: '#FFB4A2',
    viewpoint: '#FF8E8E',
  }
  const color = colors[category] || '#FF6B6B'

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
      background: ${color}; transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px ${color}66;
    "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg)"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

export default function ExplorePage({ isSaved, toggleSave }) {
  const [view, setView] = useState('map')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(null)

  const filtered = useMemo(() =>
    places.filter(p => {
      const matchCategory = category === 'all' || p.category === category
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCategory && matchSearch
    }),
    [category, searchQuery]
  )

  const center = [40.7580, -73.9855]

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-warm-white sticky top-0 z-30 border-b border-sand/40">
        <div className="px-5 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-navy">Explore</h1>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('map')}
                className={`p-2 rounded-xl transition-colors ${
                  view === 'map' ? 'bg-coral text-white' : 'bg-sand/40 text-slate'
                }`}
              >
                <MapIcon size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('list')}
                className={`p-2 rounded-xl transition-colors ${
                  view === 'list' ? 'bg-coral text-white' : 'bg-sand/40 text-slate'
                }`}
              >
                <List size={18} />
              </motion.button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              type="text"
              placeholder="Find a place near you..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-sand/30 text-navy text-sm placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-coral/30 transition"
            />
          </div>
        </div>
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Map View */}
            <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg" style={{ height: 'calc(100vh - 320px)' }}>
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {filtered.map(place => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={createMarkerIcon(place.category)}
                    eventHandlers={{
                      click: () => setSelectedPlace(place),
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="font-sans p-1">
                        <img src={place.image} alt={place.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <h3 className="font-bold text-sm">{place.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={12} className="fill-amber text-amber" />
                          <span className="text-xs">{place.rating}</span>
                          <span className="text-xs text-gray-400">· {place.priceRange}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map overlay info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-navy font-semibold text-sm">{filtered.length} places nearby</p>
                    <p className="text-warm-gray text-xs">Tap a pin for details</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-coral text-white rounded-xl text-sm font-medium"
                  >
                    <Navigation size={14} />
                    Near me
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 mt-4"
          >
            <p className="text-warm-gray text-sm mb-4">{filtered.length} places found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((place, i) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  index={i}
                  isSaved={isSaved(place.id)}
                  onToggleSave={toggleSave}
                  onSelect={setSelectedPlace}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PlaceDetail
        place={selectedPlace}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isSaved={selectedPlace ? isSaved(selectedPlace.id) : false}
        onToggleSave={toggleSave}
      />
    </div>
  )
}
