import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { Search, List, Map as MapIcon, Navigation, MapPin } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import CategoryFilter from '../components/CategoryFilter'
import PlaceDetail from '../components/PlaceDetail'
import { places, categoryMeta } from '../data/mockData'
import { useLang } from '../lib/i18n'

function createMarkerIcon(category) {
  const color = categoryMeta[category]?.color ?? '#EFB35C'
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="position:relative;width:18px;height:18px">
      <div class="marker-pulse" style="background:${color}30"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.85);box-shadow:0 0 14px 3px ${color}99"></div>
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  })
}

// Kyiv — Maidan Nezalezhnosti
const KYIV_CENTER = [50.4501, 30.5234]

export default function ExplorePage({ isSaved, toggleSave, isVisited, toggleVisited }) {
  const { t } = useLang()
  const [view, setView] = useState('map')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(null)

  const filtered = useMemo(() =>
    places.filter(p => {
      const q = searchQuery.toLowerCase()
      const matchCategory = category === 'all' || p.category === category
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.name_uk || '').toLowerCase().includes(q) ||
        p.tags.some(tg => tg.toLowerCase().includes(q))
      return matchCategory && matchSearch
    }),
    [category, searchQuery]
  )

  return (
    <div className="min-h-screen pb-32">
      {/* header */}
      <div className="sticky top-0 z-30 bg-ink/85 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="px-5 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-2xl text-cream">{t('explore.title')}</h1>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-ink-3/70 hairline">
              {[
                { id: 'map', icon: MapIcon, label: 'Map view' },
                { id: 'list', icon: List, label: 'List view' },
              ].map(({ id, icon: Icon, label }) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setView(id)}
                  aria-label={label}
                  aria-pressed={view === id}
                  className={`p-2 rounded-xl transition-all ${
                    view === id ? 'bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(239,179,92,0.3)]' : 'text-faint'
                  }`}
                >
                  <Icon size={17} />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="text"
              placeholder={t('explore.search')}
              aria-label={t('explore.search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-ink-3/70 hairline text-cream text-sm placeholder:text-faint outline-none focus:border-gold/30 transition-colors"
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
            {/* isolate: contain Leaflet's z-indexes (400-1000) so fixed sheets stack above the map */}
            <div
              className="relative isolate z-0 mx-4 mt-4 rounded-3xl overflow-hidden hairline shadow-pop"
              style={{ height: 'calc(100vh - 350px)', minHeight: 380 }}
            >
              <MapContainer
                center={KYIV_CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {filtered.map(place => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={createMarkerIcon(place.category)}
                    eventHandlers={{
                      click: () => setSelectedPlace(place),
                    }}
                  />
                ))}
              </MapContainer>

              {/* overlay info */}
              <div className="absolute bottom-4 left-4 right-4 z-[1000]">
                <div className="glass-panel rounded-2xl p-3 flex items-center justify-between shadow-pop">
                  <div>
                    <p className="text-cream font-semibold text-sm">{t('explore.onMap', { n: filtered.length })}</p>
                    <p className="text-faint text-xs">{t('explore.tapPin')}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-sm font-semibold"
                  >
                    <Navigation size={14} />
                    {t('explore.nearMe')}
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
            <p className="text-faint text-sm mb-4">{t('explore.found', { n: filtered.length })}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <MapPin size={28} className="mx-auto text-faint mb-3" />
                <p className="font-display text-cream text-lg">{t('home.emptyTitle')}</p>
                <p className="text-faint text-sm mt-1">{t('home.emptySub')}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <PlaceDetail
        place={selectedPlace}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isSaved={selectedPlace ? isSaved(selectedPlace.id) : false}
        onToggleSave={toggleSave}
        isVisited={selectedPlace ? isVisited(selectedPlace.id) : false}
        onToggleVisited={toggleVisited}
      />
    </div>
  )
}
