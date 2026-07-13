import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MapPin, Clock, Star, Share2, Navigation, ChevronLeft, ChevronRight, Bookmark, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from './Toast'
import { buzz } from '../lib/haptics'
import AddToCollectionModal from './AddToCollectionModal'
import { categoryMeta } from '../data/mockData'
import { useLang } from '../lib/i18n'

export default function PlaceDetail({ place, isOpen, onClose, isSaved, onToggleSave, isVisited, onToggleVisited }) {
  const showToast = useToast()
  const { t, pick, price } = useLang()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [collectionOpen, setCollectionOpen] = useState(false)

  // fresh carousel for every place — stale indexes point at missing photos
  useEffect(() => {
    setPhotoIndex(0)
  }, [place?.id])

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!place) return null
  const meta = categoryMeta[place.category]
  const name = pick(place, 'name')

  function handleSave() {
    buzz()
    onToggleSave?.(place.id)
    showToast({ message: isSaved ? t('toast.unpinned') : t('toast.pinned', { name }) })
  }

  function handleVisited() {
    buzz()
    onToggleVisited?.(place.id)
    showToast({ message: isVisited ? t('toast.unlived') : t('toast.lived') })
  }

  function handleShare() {
    if (navigator.share) {
      // user dismissing the share sheet rejects the promise — that's fine
      navigator.share({ title: name, text: pick(place, 'description') }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
      showToast({ message: t('toast.linkCopied'), type: 'info' })
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] max-w-lg mx-auto bg-ink-2 rounded-t-[28px] max-h-[92vh] overflow-y-auto hairline-t shadow-pop"
              role="dialog"
              aria-label={name}
            >
              {/* photo hero — full bleed */}
              <div className="relative h-72 overflow-hidden rounded-t-[28px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={place.photos?.[photoIndex] || place.image}
                    alt={name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-black/30" />

                <div className="absolute top-0 inset-x-0 flex justify-center pt-3">
                  <div className="w-10 h-1 rounded-full bg-white/25" />
                </div>

                {place.photos?.length > 1 && (
                  <>
                    <button
                      aria-label="Previous photo"
                      onClick={() => setPhotoIndex(i => (i - 1 + place.photos.length) % place.photos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-chip flex items-center justify-center"
                    >
                      <ChevronLeft size={16} className="text-cream" />
                    </button>
                    <button
                      aria-label="Next photo"
                      onClick={() => setPhotoIndex(i => (i + 1) % place.photos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-chip flex items-center justify-center"
                    >
                      <ChevronRight size={16} className="text-cream" />
                    </button>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {place.photos.map((_, i) => (
                        <motion.button
                          key={i}
                          aria-label={`Photo ${i + 1}`}
                          onClick={() => setPhotoIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIndex ? 'bg-gold' : 'bg-white/35'}`}
                          animate={{ scale: i === photoIndex ? 1.4 : 1 }}
                        />
                      ))}
                    </div>
                  </>
                )}

                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full glass-chip flex items-center justify-center"
                >
                  <X size={15} className="text-cream" />
                </button>

                {/* name over image */}
                <div className="absolute bottom-0 inset-x-0 px-5 pb-3">
                  {meta && (
                    <span
                      className="inline-block text-[11px] font-semibold tracking-widest uppercase mb-1"
                      style={{ color: meta.color }}
                    >
                      {pick(meta, 'label')}
                    </span>
                  )}
                  <h2 className="font-display text-3xl text-cream leading-tight">{name}</h2>
                  {place.cuisine && <p className="text-muted text-sm mt-0.5">{pick(place, 'cuisine')}</p>}
                </div>
              </div>

              {/* content */}
              <div className="px-5 pt-4 pb-28">
                {/* rating row + actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Star size={15} className="fill-gold text-gold" />
                      <span className="font-bold text-cream">{place.rating}</span>
                      <span className="text-faint text-xs">({place.reviewCount})</span>
                    </div>
                    {place.priceRange && (
                      <span className="text-gold-soft font-semibold text-sm">{price(place.priceRange)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleSave}
                      aria-label={isSaved ? t('toast.unpinned') : t('toast.pinned', { name })}
                      aria-pressed={isSaved}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border ${
                        isSaved
                          ? 'bg-gold/15 border-gold/40 text-gold glow-gold'
                          : 'bg-ink-3 border-white/[0.07] text-muted'
                      }`}
                    >
                      <Heart size={18} className={isSaved ? 'fill-gold' : ''} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleVisited}
                      aria-label={isVisited ? t('toast.unlived') : t('toast.lived')}
                      aria-pressed={isVisited}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border ${
                        isVisited
                          ? 'bg-mint/15 border-mint/40 text-mint'
                          : 'bg-ink-3 border-white/[0.07] text-muted'
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleShare}
                      aria-label={t('fr.share')}
                      className="w-11 h-11 rounded-full bg-ink-3 border border-white/[0.07] text-muted flex items-center justify-center"
                    >
                      <Share2 size={17} />
                    </motion.button>
                  </div>
                </div>

                {/* info cards */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-ink-3/70 hairline rounded-2xl p-3.5">
                    <div className="flex items-center gap-2 text-gold">
                      <MapPin size={14} />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">{t('pd.location')}</span>
                    </div>
                    <p className="text-cream/90 text-[13px] mt-2 leading-snug">{pick(place, 'address')}</p>
                  </div>
                  <div className="bg-ink-3/70 hairline rounded-2xl p-3.5">
                    <div className="flex items-center gap-2 text-gold">
                      <Clock size={14} />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">{t('pd.hours')}</span>
                    </div>
                    <p className="text-cream/90 text-[13px] mt-2 leading-snug line-clamp-2">{pick(place, 'hours')}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="font-display italic text-gold-soft text-lg mb-1.5">{t('pd.story')}</h3>
                  <p className="text-muted text-sm leading-relaxed">{pick(place, 'description')}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {place.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-ink-3/70 hairline text-muted text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {place.savedBy?.length > 0 && (
                  <div className="mt-5 pt-4 hairline-t">
                    <p className="text-sm text-faint">
                      <span className="font-semibold text-gold-soft">{t('pd.friendsN', { n: place.savedBy.length })}</span> {t('pd.friendsKeep')}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDirections}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 btn-gold font-semibold rounded-2xl text-sm"
                  >
                    <Navigation size={17} />
                    {t('pd.directions')}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCollectionOpen(true)}
                    className="flex items-center justify-center gap-2 py-3.5 px-5 bg-ink-3 hairline text-cream font-semibold rounded-2xl text-sm"
                  >
                    <Bookmark size={17} />
                    {t('pd.collect')}
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
