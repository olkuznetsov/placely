import { motion } from 'framer-motion'
import { Heart, Star, MapPin } from 'lucide-react'
import TiltCard from './TiltCard'
import { categoryMeta } from '../data/mockData'
import { categoryIcons } from '../lib/icons'
import { useToast } from './Toast'

export default function PlaceCard({ place, index = 0, isSaved, onToggleSave, onSelect }) {
  const showToast = useToast()
  const meta = categoryMeta[place.category]
  const CatIcon = meta ? categoryIcons[meta.icon] : MapPin

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.45, ease: 'easeOut' }}
    >
      <TiltCard className="h-72" onClick={() => onSelect?.(place)}>
        {/* full-bleed photo */}
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* cinematic scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink/55 to-transparent" />

        {/* category chip */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-chip">
          {CatIcon && <CatIcon size={12} style={{ color: meta?.color }} />}
          <span className="text-[11px] font-semibold tracking-wide text-cream/90">
            {meta?.label ?? place.category}
          </span>
        </div>

        {/* save button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSave?.(place.id)
            showToast({ message: isSaved ? 'Removed from your atlas' : `Pinned "${place.name}" ✦` })
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full glass-chip flex items-center justify-center transition-shadow ${
            isSaved ? 'glow-gold' : ''
          }`}
        >
          <motion.div animate={isSaved ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart size={17} className={isSaved ? 'fill-gold text-gold' : 'text-cream/85'} />
          </motion.div>
        </motion.button>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-xl leading-snug text-cream line-clamp-1">
                {place.name}
              </h3>
              <p className="text-muted text-xs mt-0.5 line-clamp-1">
                {[place.cuisine, place.priceRange].filter(Boolean).join(' · ')}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full glass-chip shrink-0">
              <Star size={11} className="fill-gold text-gold" />
              <span className="text-xs font-semibold text-gold-soft">{place.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-1 text-faint text-[11px] min-w-0">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">{place.address}</span>
            </div>
            {place.savedBy?.length > 0 && (
              <span className="text-[11px] text-muted shrink-0 ml-2">
                ♥ {place.savedBy.length} friends
              </span>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}
