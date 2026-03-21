import { motion } from 'framer-motion'
import { Heart, MapPin, Star } from 'lucide-react'
import { useToast } from './Toast'

export default function PlaceCard({ place, isSaved, onToggleSave, onSelect }) {
  const showToast = useToast()
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect?.(place)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSave?.(place.id)
            showToast({ message: isSaved ? 'Removed from saved' : `Saved "${place.name}"!` })
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center"
        >
          <motion.div
            animate={isSaved ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={18}
              className={isSaved ? 'fill-coral text-coral' : 'text-white'}
            />
          </motion.div>
        </motion.button>

        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass text-[11px] font-semibold text-white">
          {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
        </div>

        {/* Price & Rating on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber/90 text-white text-xs font-bold">
              <Star size={12} className="fill-white" />
              {place.rating}
            </div>
            <span className="text-white/80 text-xs">({place.reviewCount})</span>
          </div>
          {place.priceRange && (
            <span className="text-white font-semibold text-sm">{place.priceRange}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-navy text-[15px] line-clamp-1 group-hover:text-coral transition-colors">
          {place.name}
        </h3>
        {place.cuisine && (
          <p className="text-warm-gray text-xs mt-0.5">{place.cuisine}</p>
        )}
        <div className="flex items-center gap-1 mt-2 text-slate text-xs">
          <MapPin size={12} />
          <span className="line-clamp-1">{place.address}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {place.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-peach-light/40 text-coral-dark text-[11px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Added by */}
        {place.addedBy && place.addedBy.name !== 'You' && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sand/50">
            <img
              src={place.addedBy.avatar}
              alt={place.addedBy.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-[11px] text-warm-gray">
              Added by <span className="font-semibold text-navy">{place.addedBy.name}</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
