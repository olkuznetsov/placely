import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Lock, ChevronRight, Heart, ArrowLeft } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import PlaceDetail from '../components/PlaceDetail'
import { collections, places } from '../data/mockData'

/** 3D deck — preview photos stacked like polaroids that fan out on hover */
function CollectionCard({ collection, onClick, index }) {
  const idSet = useMemo(() => new Set(collection.placeIds), [collection.placeIds])
  const collectionPlaces = useMemo(() => places.filter(p => idSet.has(p.id)), [idSet])
  const previewImages = collectionPlaces.slice(0, 3).map(p => p.image)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover="fan"
      onClick={onClick}
      className="cursor-pointer group"
    >
      {/* the deck */}
      <div className="relative h-44 mb-3" style={{ perspective: 700 }}>
        {previewImages.map((src, i) => (
          <motion.div
            key={i}
            variants={{
              fan: {
                rotate: (i - 1) * 8,
                x: (i - 1) * 26,
                y: i === 1 ? -8 : 0,
              },
            }}
            initial={false}
            animate={{ rotate: (i - 1) * 3.5, x: (i - 1) * 9, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="absolute inset-x-6 top-2 bottom-2 rounded-2xl overflow-hidden hairline shadow-pop"
            style={{ zIndex: i === 1 ? 3 : i, transformOrigin: 'bottom center' }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            {i === 1 && collection.placeIds.length > 3 && (
              <span className="absolute bottom-2 right-2.5 text-[11px] font-bold text-cream/90 glass-chip px-2 py-0.5 rounded-full">
                +{collection.placeIds.length - 3}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* label */}
      <div className="px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
              style={{ background: `${collection.color}1C`, boxShadow: `inset 0 0 0 1px ${collection.color}45` }}
            >
              {collection.emoji}
            </span>
            <h3 className="font-display text-lg text-cream truncate">{collection.name}</h3>
          </div>
          <ChevronRight size={16} className="text-faint group-hover:text-gold transition-colors shrink-0" />
        </div>
        <div className="flex items-center gap-3 mt-1.5 ml-10">
          <span className="text-xs text-faint">{collection.placeIds.length} places</span>
          {collection.isShared ? (
            <span className="flex items-center gap-1 text-xs" style={{ color: collection.color }}>
              <Users size={11} /> Shared
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-faint">
              <Lock size={11} /> Private
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function CollectionsPage({ isSaved, toggleSave, isVisited, toggleVisited }) {
  const [activeCollection, setActiveCollection] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)

  const collectionPlaces = useMemo(() => {
    if (!activeCollection) return []
    const idSet = new Set(activeCollection.placeIds)
    return places.filter(p => idSet.has(p.id))
  }, [activeCollection])

  const savedPlaceIds = useMemo(() =>
    places.filter(p => isSaved(p.id)).map(p => p.id),
    [isSaved]
  )

  return (
    <div className="min-h-screen pb-32">
      {/* header */}
      <div className="px-5 pt-12 pb-4 sticky top-0 z-20 bg-ink/85 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {activeCollection ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setActiveCollection(null)}
                className="flex items-center gap-2 text-gold-soft font-medium text-sm mb-2"
              >
                <ArrowLeft size={15} />
                Collections
              </button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeCollection.emoji}</span>
                <div>
                  <h1 className="font-display text-2xl text-cream">{activeCollection.name}</h1>
                  <p className="text-faint text-sm">{collectionPlaces.length} places</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl text-cream">Collections</h1>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-sm font-semibold"
                >
                  <Plus size={15} />
                  New
                </motion.button>
              </div>
              <p className="text-faint text-sm mt-1">Constellations of your favorite spots</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {activeCollection ? (
          <motion.div
            key="places"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {collectionPlaces.map((place, i) => (
              <PlaceCard
                key={place.id}
                place={place}
                index={i}
                isSaved={isSaved(place.id)}
                onToggleSave={toggleSave}
                onSelect={setSelectedPlace}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="collections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 mt-2"
          >
            {/* all saved — the golden card */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-3xl p-5 mb-7 cursor-pointer btn-gold"
              onClick={() => setActiveCollection({
                id: 'all',
                name: 'All Saved Places',
                emoji: '✦',
                placeIds: savedPlaceIds,
                isShared: false,
              })}
            >
              <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-white/20 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black/15 flex items-center justify-center">
                    <Heart size={22} className="text-[#1A1405] fill-[#1A1405]" />
                  </div>
                  <div>
                    <h3 className="font-display text-[#1A1405] text-xl">All saved places</h3>
                    <p className="text-[#1A1405]/70 text-sm font-medium">
                      {savedPlaceIds.length} pins in your atlas
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[#1A1405]/60" />
              </div>
            </motion.div>

            {/* deck grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-7">
              {collections.map((collection, i) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  index={i}
                  onClick={() => setActiveCollection(collection)}
                />
              ))}
            </div>

            {/* create new */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mt-7 border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gold/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                <Plus size={22} className="text-gold" />
              </div>
              <p className="font-display text-cream text-lg">New collection</p>
              <p className="text-faint text-sm mt-1">Start a new constellation</p>
            </motion.div>
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
