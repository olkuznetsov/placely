import { useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, Bell, Sparkles, TrendingUp, MapPin, ChevronRight } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import CategoryFilter from '../components/CategoryFilter'
import PlaceDetail from '../components/PlaceDetail'
import { places, activityFeed, userProfile, categories } from '../data/mockData'

export default function HomePage({ isSaved, toggleSave }) {
  const [category, setCategory] = useState('all')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const heroRef = useRef(null)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1])

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

  return (
    <div className="min-h-screen pb-24">
      {/* Parallax Hero */}
      <div ref={heroRef} className="relative h-80 overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-coral via-coral-light to-peach animate-gradient" />
          <div className="absolute inset-0 opacity-20">
            {/* Decorative floating circles */}
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-12 right-12 w-32 h-32 rounded-full bg-white/20"
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute bottom-8 left-8 w-20 h-20 rounded-full bg-white/15"
            />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              className="absolute top-20 left-1/3 w-16 h-16 rounded-full bg-white/10"
            />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex flex-col justify-end h-full px-5 pb-6"
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-12">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">Placely</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative w-9 h-9 rounded-full glass flex items-center justify-center"
            >
              <Bell size={18} className="text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber border-2 border-coral" />
            </motion.button>
          </div>

          <h1 className="text-white text-3xl font-bold leading-tight">
            Hey, {userProfile.name.split(' ')[0]}! <span className="inline-block animate-float">👋</span>
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Discover your next favorite spot
          </p>

          {/* Search bar */}
          <div className="relative mt-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              type="text"
              placeholder="Search places, cuisines, or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white shadow-lg text-navy text-sm placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-coral/30 transition-shadow"
            />
          </div>
        </motion.div>
      </div>

      {/* Category Filters */}
      <CategoryFilter active={category} onChange={setCategory} />

      {/* Quick Stats */}
      <div className="flex gap-3 px-5 mt-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex-1 bg-gradient-to-r from-coral/10 to-peach/20 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center">
              <MapPin size={14} className="text-coral" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{userProfile.savedPlaces}</p>
              <p className="text-xs text-warm-gray">Saved Places</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex-1 bg-gradient-to-r from-mint/10 to-mint/5 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center">
              <TrendingUp size={14} className="text-mint" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{userProfile.visitedPlaces}</p>
              <p className="text-xs text-warm-gray">Visited</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Friend Activity - horizontal scroll */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-bold text-navy text-lg">Friend Activity</h2>
          <button className="text-coral text-sm font-medium flex items-center gap-0.5">
            See All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
          {activityFeed.slice(0, 4).map((activity, i) => (
            <div
              key={activity.id}
              className="flex-shrink-0 w-72 bg-white rounded-2xl p-4 border border-sand/40 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold text-navy">{activity.user.name}</span>{' '}
                    <span className="text-warm-gray">
                      {activity.action === 'saved' && 'saved'}
                      {activity.action === 'visited' && 'visited'}
                      {activity.action === 'reviewed' && 'reviewed'}
                      {activity.action === 'created_collection' && 'created'}
                    </span>
                  </p>
                  {activity.place && (
                    <p className="text-xs text-coral font-medium truncate">{activity.place.name}</p>
                  )}
                  {activity.collectionName && (
                    <p className="text-xs text-coral font-medium">{activity.collectionName}</p>
                  )}
                </div>
                <span className="text-[11px] text-warm-gray whitespace-nowrap">{activity.time}</span>
              </div>
              {activity.note && (
                <p className="text-xs text-slate mt-2.5 line-clamp-2 leading-relaxed">{activity.note}</p>
              )}
              {activity.photo && (
                <img
                  src={activity.photo}
                  alt=""
                  className="w-full h-24 object-cover rounded-xl mt-2.5"
                />
              )}
              {activity.rating && (
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: activity.rating }).map((_, i) => (
                    <span key={i} className="text-amber text-xs">★</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy text-lg">
            {category === 'all' ? 'Trending Places' : `${categories.find(c => c.id === category)?.label || ''}`}
          </h2>
          <span className="text-sm text-warm-gray">{filtered.length} places</span>
        </div>
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
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-navy font-semibold">No places found</p>
            <p className="text-warm-gray text-sm mt-1">Try a different search or category</p>
          </motion.div>
        )}
      </div>

      {/* Place Detail Sheet */}
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
