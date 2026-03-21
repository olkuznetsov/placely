import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Lock, ChevronRight, Heart, ArrowLeft } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import PlaceDetail from '../components/PlaceDetail'
import { collections, places } from '../data/mockData'

function CollectionCard({ collection, onClick, index }) {
  const idSet = useMemo(() => new Set(collection.placeIds), [collection.placeIds])
  const collectionPlaces = useMemo(() => places.filter(p => idSet.has(p.id)), [idSet])
  const previewImages = collectionPlaces.slice(0, 3).map(p => p.image)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-sand/40"
    >
      {/* Image mosaic */}
      <div className="h-36 flex gap-0.5 overflow-hidden">
        {previewImages[0] && (
          <div className={`${previewImages.length > 1 ? 'w-2/3' : 'w-full'} h-full`}>
            <img src={previewImages[0]} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        {previewImages.length > 1 && (
          <div className="w-1/3 flex flex-col gap-0.5">
            <div className="flex-1">
              <img src={previewImages[1]} alt="" className="w-full h-full object-cover" />
            </div>
            {previewImages[2] && (
              <div className="flex-1 relative">
                <img src={previewImages[2]} alt="" className="w-full h-full object-cover" />
                {collection.placeIds.length > 3 && (
                  <div className="absolute inset-0 bg-navy/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">+{collection.placeIds.length - 3}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{collection.emoji}</span>
            <h3 className="font-bold text-navy">{collection.name}</h3>
          </div>
          <ChevronRight size={16} className="text-warm-gray" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-warm-gray">{collection.placeIds.length} places</span>
          {collection.isShared ? (
            <span className="flex items-center gap-1 text-xs text-sky">
              <Users size={12} /> Shared
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-warm-gray">
              <Lock size={12} /> Private
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function CollectionsPage({ isSaved, toggleSave }) {
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
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-warm-white sticky top-0 z-20">
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
                className="flex items-center gap-2 text-coral font-medium text-sm mb-2"
              >
                <ArrowLeft size={16} />
                Collections
              </button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeCollection.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold text-navy">{activeCollection.name}</h1>
                  <p className="text-warm-gray text-sm">{collectionPlaces.length} places</p>
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
                <h1 className="text-2xl font-bold text-navy">Collections</h1>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-coral text-white rounded-xl text-sm font-medium shadow-lg shadow-coral/20"
                >
                  <Plus size={16} />
                  New
                </motion.button>
              </div>
              <p className="text-warm-gray text-sm mt-1">Organize your favorite spots</p>
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
            {/* All Saved */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-r from-coral to-coral-light rounded-2xl p-5 mb-4 cursor-pointer shadow-lg shadow-coral/20"
              onClick={() => setActiveCollection({
                id: 'all',
                name: 'All Saved Places',
                emoji: '❤️',
                placeIds: savedPlaceIds,
                isShared: false,
              })}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Heart size={24} className="text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">All Saved Places</h3>
                    <p className="text-white/70 text-sm">
                      {savedPlaceIds.length} places
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white/70" />
              </div>
            </motion.div>

            {/* Collection grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collections.map((collection, i) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  index={i}
                  onClick={() => setActiveCollection(collection)}
                />
              ))}
            </div>

            {/* Create new collection CTA */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mt-4 border-2 border-dashed border-sand rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-coral/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-peach-light/40 flex items-center justify-center mb-3">
                <Plus size={24} className="text-coral" />
              </div>
              <p className="font-semibold text-navy">Create a New Collection</p>
              <p className="text-warm-gray text-sm mt-1">Group your favorite spots together</p>
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
      />
    </div>
  )
}
