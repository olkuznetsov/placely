import { motion } from 'framer-motion'
import { Heart, Star, MapPin } from 'lucide-react'
import TiltCard from './TiltCard'
import { categoryMeta, friends } from '../data/mockData'
import { categoryIcons } from '../lib/icons'
import { useToast } from './Toast'
import FadeImg from '../lib/FadeImg'
import { buzz } from '../lib/haptics'
import { useLang } from '../lib/i18n'

export default function PlaceCard({ place, index = 0, isSaved, onToggleSave, onSelect }) {
  const showToast = useToast()
  const { t, pick, price } = useLang()
  const meta = categoryMeta[place.category]
  const CatIcon = meta ? categoryIcons[meta.icon] : MapPin
  const savers = friends.filter(f => place.savedBy?.includes(f.id)).slice(0, 3)
  const name = pick(place, 'name')

  return (
    <motion.div
      initial={{ opacity: 0, y: 44, rotateX: -14 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px 0px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 900 }}
    >
      <TiltCard className="h-72" onClick={() => onSelect?.(place)}>
        {/* clipped photo layer — the photo counter-drifts against the tilt */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden hairline shadow-depth bg-ink-2">
          <FadeImg
            src={place.image}
            alt={name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute -inset-4 object-cover"
            style={{ transform: 'translate3d(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -10px), 0)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink/55 to-transparent" />
        </div>

        {/* category chip — floats above the photo */}
        <div
          className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-chip"
          style={{ transform: 'translateZ(26px)' }}
        >
          {CatIcon && <CatIcon size={12} style={{ color: meta?.color }} />}
          <span className="text-[11px] font-semibold tracking-wide text-cream/90">
            {meta ? pick(meta, 'label') : place.category}
          </span>
        </div>

        {/* save button — highest layer, 44px touch target */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          aria-label={isSaved ? t('toast.unpinned') : t('toast.pinned', { name })}
          aria-pressed={isSaved}
          onClick={(e) => {
            e.stopPropagation()
            buzz()
            onToggleSave?.(place.id)
            showToast({ message: isSaved ? t('toast.unpinned') : t('toast.pinned', { name }) })
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-11 h-11 rounded-full glass-chip flex items-center justify-center transition-shadow ${
            isSaved ? 'glow-gold' : ''
          }`}
          style={{ z: 34 }}
        >
          <motion.div animate={isSaved ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart size={18} className={isSaved ? 'fill-gold text-gold' : 'text-cream/85'} />
          </motion.div>
        </motion.button>

        {/* bottom content — pops toward the viewer */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 p-4"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-xl leading-snug text-cream line-clamp-1">
                {name}
              </h3>
              <p className="text-muted text-xs mt-0.5 line-clamp-1">
                {[pick(place, 'cuisine'), price(place.priceRange)].filter(Boolean).join(' · ')}
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
              <span className="truncate">{pick(place, 'address')}</span>
            </div>
            {savers.length > 0 && (
              <div className="flex items-center shrink-0 ml-2">
                <div className="flex -space-x-2">
                  {savers.map(f => (
                    <img
                      key={f.id}
                      src={f.avatar}
                      alt={f.name}
                      className="w-5 h-5 rounded-full object-cover ring-2 ring-ink/70"
                    />
                  ))}
                </div>
                {place.savedBy.length > savers.length && (
                  <span className="text-[10px] text-muted ml-1.5">
                    +{place.savedBy.length - savers.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}
