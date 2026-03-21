import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MapPin, Clock, Star, Share2, Navigation, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './Toast'
import AddToCollectionModal from './AddToCollectionModal'

export default function PlaceDetail({ place, isOpen, onClose, isSaved, onToggleSave }) {
  const showToast = useToast()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [collectionOpen, setCollectionOpen] = useState(false)

  if (!place) return null

  function handleSave() {
    onToggleSave?.(place.id)
    showToast({ message: isSaved ? 'Removed from saved' : `Saved "${place.name}"!` })
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: place.name, text: place.description })
    } else {
      navigator.clipboard?.writeText(window.location.href)
      showToast({ message: 'Link copied to clipboard!', type: 'info' })
    }
  }

  function handleDirections() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
    window.open(url, '_blank')
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-warm-white rounded-t-3xl max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 rounded-full bg-sand" />
              </div>

              {/* Photo carousel */}
              <div className="relative h-64 mx-4 rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={place.photos?.[photoIndex] || place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {place.photos?.length > 1 && (
                  <>
                    <button
                      onClick={() => setPhotoIndex(i => (i - 1 + place.photos.length) % place.photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center"
                    >
                      <ChevronLeft size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => setPhotoIndex(i => (i + 1) % place.photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center"
                    >
                      <ChevronRight size={16} className="text-white" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {place.photos.map((_, i) => (
                        <motion.button
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${i === photoIndex ? 'bg-white' : 'bg-white/40'}`}
                          animate={{ scale: i === photoIndex ? 1.2 : 1 }}
                        />
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pt-4 pb-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-navy">{place.name}</h2>
                    {place.cuisine && (
                      <p className="text-warm-gray text-sm mt-0.5">{place.cuisine}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleSave}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                        isSaved ? 'bg-coral text-white' : 'bg-peach-light/50 text-coral'
                      }`}
                    >
                      <Heart size={20} className={isSaved ? 'fill-white' : ''} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleShare}
                      className="w-11 h-11 rounded-full bg-sky/10 text-sky flex items-center justify-center"
                    >
                      <Share2 size={20} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="fill-amber text-amber" />
                    <span className="font-bold text-navy">{place.rating}</span>
                    <span className="text-warm-gray text-sm">({place.reviewCount} reviews)</span>
                  </div>
                  {place.priceRange && (
                    <span className="text-mint font-semibold">{place.priceRange}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-cream rounded-xl p-3">
                    <div className="flex items-center gap-2 text-coral">
                      <MapPin size={15} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Location</span>
                    </div>
                    <p className="text-navy text-sm mt-1.5">{place.address}</p>
                  </div>
                  <div className="bg-cream rounded-xl p-3">
                    <div className="flex items-center gap-2 text-coral">
                      <Clock size={15} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Hours</span>
                    </div>
                    <p className="text-navy text-sm mt-1.5 line-clamp-2">{place.hours}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="font-semibold text-navy text-sm mb-2">About</h3>
                  <p className="text-slate text-sm leading-relaxed">{place.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {place.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-peach-light/30 text-coral-dark text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                {place.savedBy?.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-sand/50">
                    <p className="text-sm text-warm-gray">
                      <span className="font-semibold text-navy">{place.savedBy.length} friends</span> saved this place
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDirections}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-coral text-white font-semibold rounded-xl shadow-lg shadow-coral/25"
                  >
                    <Navigation size={18} />
                    Directions
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCollectionOpen(true)}
                    className="flex items-center justify-center gap-2 py-3.5 px-5 bg-navy text-white font-semibold rounded-xl"
                  >
                    <Bookmark size={18} />
                    Collect
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddToCollectionModal
        place={place}
        isOpen={collectionOpen}
        onClose={() => setCollectionOpen(false)}
      />
    </>
  )
}
