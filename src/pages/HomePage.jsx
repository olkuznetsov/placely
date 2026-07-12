import { useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Search, Bell, MapPin, Flame, ChevronRight } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import CategoryFilter from '../components/CategoryFilter'
import PlaceDetail from '../components/PlaceDetail'
import WishDeck from '../components/WishDeck'
import { places, activityFeed, userProfile, categories, friends } from '../data/mockData'

// deterministic star field — same sky every night
const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 991 + n * 77.7) * 10000
    return x - Math.floor(x)
  }
  return {
    left: `${(r(1) * 96 + 2).toFixed(2)}%`,
    top: `${(r(2) * 55 + 2).toFixed(2)}%`,
    size: 1 + r(3) * 1.7,
    delay: `${(r(4) * 4).toFixed(2)}s`,
    dur: `${(2.4 + r(5) * 3).toFixed(2)}s`,
  }
})

// glowing wishlist pins floating over the ridges
const PINS = [
  { left: '15%', bottom: 84, color: '#5EEAD4', size: 16, delay: 0 },
  { left: '56%', bottom: 122, color: '#EFB35C', size: 20, delay: 1.4 },
  { left: '83%', bottom: 70, color: '#FB7185', size: 14, delay: 0.7 },
]

function HeroScene() {
  const { scrollY } = useScroll()
  // farther layers drift down more = appear slower than the scroll
  const skyY = useTransform(scrollY, [0, 420], [0, 150])
  const auroraY = useTransform(scrollY, [0, 420], [0, 110])
  const backRidgeY = useTransform(scrollY, [0, 420], [0, 70])
  const pinsY = useTransform(scrollY, [0, 420], [0, 46])
  const frontRidgeY = useTransform(scrollY, [0, 420], [0, 24])
  const contentOpacity = useTransform(scrollY, [0, 260], [1, 0])
  const contentY = useTransform(scrollY, [0, 300], [0, -36])

  // pointer parallax — the scene pans against the cursor, near layers most
  const hx = useMotionValue(0)
  const shx = useSpring(hx, { stiffness: 60, damping: 18 })
  const skyX = useTransform(shx, v => v * -4)
  const auroraX = useTransform(shx, v => v * -9)
  const backRidgeX = useTransform(shx, v => v * -14)
  const pinsX = useTransform(shx, v => v * -20)
  const frontRidgeX = useTransform(shx, v => v * -28)

  function handlePointer(e) {
    const r = e.currentTarget.getBoundingClientRect()
    hx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
  }

  return (
    <div
      className="relative h-[440px] overflow-hidden bg-ink-sky"
      onMouseMove={handlePointer}
      onMouseLeave={() => hx.set(0)}
    >
      {/* sky: stars */}
      <motion.div style={{ y: skyY, x: skyX }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E22] via-[#0D1124] to-ink" />
        {STARS.map((s, i) => (
          <div
            key={i}
            className="star absolute rounded-full bg-cream"
            style={{
              left: s.left, top: s.top,
              width: s.size, height: s.size,
              '--delay': s.delay, '--dur': s.dur,
            }}
          />
        ))}
      </motion.div>

      {/* aurora */}
      <motion.div style={{ y: auroraY, x: auroraX }} className="absolute inset-0 pointer-events-none">
        <div className="animate-drift absolute -left-16 top-24 w-72 h-44 rounded-full opacity-25"
          style={{ background: 'radial-gradient(ellipse at center, #5EEAD4 0%, transparent 70%)', filter: 'blur(46px)' }}
        />
        <div className="animate-drift absolute right-0 top-40 w-80 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, #A78BFA 0%, transparent 70%)', filter: 'blur(52px)', animationDelay: '3s' }}
        />
      </motion.div>

      {/* back ridge */}
      <motion.div style={{ y: backRidgeY, x: backRidgeX }} className="absolute -inset-x-8 bottom-6">
        {/* golden-hour glow sinking behind the peaks */}
        <div
          className="absolute -top-28 left-1/2 -translate-x-1/2 w-[480px] h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center 85%, rgba(239,179,92,0.34) 0%, rgba(239,179,92,0.10) 45%, transparent 72%)', filter: 'blur(4px)' }}
        />
        <svg viewBox="0 0 375 140" preserveAspectRatio="none" className="w-full h-36 block relative">
          <path
            d="M0,140 L0,86 L46,44 L92,80 L138,30 L186,74 L232,48 L286,88 L330,58 L375,76 L375,140 Z"
            fill="#161B33"
          />
        </svg>
      </motion.div>

      {/* wishlist pins between the ridges */}
      <motion.div style={{ y: pinsY, x: pinsX }} className="absolute inset-0 pointer-events-none">
        {PINS.map((pin, i) => (
          <div
            key={i}
            className="animate-float absolute"
            style={{ left: pin.left, bottom: pin.bottom, animationDelay: `${pin.delay}s` }}
          >
            <MapPin
              size={pin.size}
              style={{ color: pin.color, filter: `drop-shadow(0 0 6px ${pin.color}) drop-shadow(0 2px 10px ${pin.color}66)` }}
            />
          </div>
        ))}
      </motion.div>

      {/* front ridge */}
      <motion.div style={{ y: frontRidgeY, x: frontRidgeX }} className="absolute -inset-x-8 -bottom-px">
        <svg viewBox="0 0 375 110" preserveAspectRatio="none" className="w-full h-28 block">
          <path
            d="M0,110 L0,74 L52,38 L104,68 L160,22 L214,62 L268,40 L322,72 L375,52 L375,110 Z"
            fill="#0A0D1A"
          />
        </svg>
      </motion.div>

      {/* foreground content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex flex-col justify-end h-full px-5 pb-8"
      >
        {/* top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-12">
          <span className="font-display italic text-2xl text-gold-gradient">Placely</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative w-9 h-9 rounded-full glass-chip flex items-center justify-center"
          >
            <Bell size={17} className="text-cream/90" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gold glow-gold" />
          </motion.button>
        </div>

        <p className="text-gold-soft/80 text-[11px] font-semibold tracking-[0.28em] uppercase mb-2">
          Your places wishlist
        </p>
        <h1 className="font-display text-cream text-[2.6rem] leading-[1.08]">
          Where to next,{' '}
          <em className="text-gold-gradient not-italic font-display italic">
            {userProfile.name.split(' ')[0]}
          </em>?
        </h1>

        {/* friends strip — this is a social app, say it up front */}
        <div className="flex items-center gap-2.5 mt-4">
          <div className="flex -space-x-2.5">
            {friends.slice(0, 3).map(f => (
              <img
                key={f.id}
                src={f.avatar}
                alt={f.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0D1124]"
              />
            ))}
          </div>
          <p className="text-muted text-xs">
            <span className="text-cream font-semibold">{friends.length} friends</span> are exploring with you
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function JourneyStrip({ savedCount, visitedCount }) {
  const pct = savedCount > 0 ? Math.min(visitedCount / savedCount, 1) : 0
  const R = 24
  const C = 2 * Math.PI * R

  return (
    <div className="mx-5 -mt-2 relative z-10 glass-panel rounded-3xl p-4 shadow-depth flex items-center gap-4">
      {/* progress ring */}
      <div className="relative w-16 h-16 shrink-0">
        <svg viewBox="0 0 60 60" className="w-16 h-16 -rotate-90">
          <circle cx="30" cy="30" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle
            cx="30" cy="30" r={R} fill="none"
            stroke="url(#goldRing)" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ filter: 'drop-shadow(0 0 4px rgba(239,179,92,0.6))', transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <defs>
            <linearGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F7D398" />
              <stop offset="100%" stopColor="#D89A47" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold text-gold-soft">{Math.round(pct * 100)}%</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display text-cream text-lg leading-tight">Your journey</p>
        <p className="text-muted text-xs mt-0.5">
          <span className="text-gold-soft font-semibold">{savedCount} pinned</span>
          {' · '}
          <span className="text-mint font-semibold">{visitedCount} lived</span>
        </p>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gold/10 border border-gold/20 shrink-0">
        <Flame size={15} className="text-gold" />
        <span className="text-gold-soft text-xs font-bold">{userProfile.streak}d</span>
      </div>
    </div>
  )
}

export default function HomePage({ isSaved, toggleSave, isVisited, toggleVisited, savedIds, visitedIds }) {
  const [category, setCategory] = useState('all')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

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

  // saved but not yet lived — the deck you're triaging
  const wishlist = useMemo(() =>
    places.filter(p => savedIds.has(p.id) && !visitedIds.has(p.id)),
    [savedIds, visitedIds]
  )

  return (
    <div className="min-h-screen pb-32">
      <HeroScene />

      {/* search — floating over the ridge line */}
      <div className="px-5 -mt-7 relative z-20">
        <div className="relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            placeholder="Search places, cravings, or tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-panel shadow-pop text-cream text-sm placeholder:text-faint outline-none focus:border-gold/30 transition-colors"
          />
        </div>
      </div>

      <div className="mt-4">
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      <div className="mt-2">
        <JourneyStrip savedCount={savedIds.size} visitedCount={visitedIds.size} />
      </div>

      {/* wishlist deck — swipeable 3D stack */}
      {wishlist.length > 0 && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between px-5 mb-3">
            <h2 className="font-display text-cream text-xl">
              Up <em className="text-gold-gradient">next</em>
            </h2>
            <span className="text-xs text-faint">{wishlist.length} on your wishlist</span>
          </div>
          <WishDeck places={wishlist} onOpen={setSelectedPlace} />
        </div>
      )}

      {/* friend activity */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-display text-cream text-xl">Friends are saving</h2>
          <button className="text-gold-soft text-xs font-semibold flex items-center gap-0.5 tracking-wide">
            SEE ALL <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
          {activityFeed.slice(0, 4).map(activity => (
            <div
              key={activity.id}
              className="flex-shrink-0 w-72 bg-ink-2 rounded-3xl p-4 hairline shadow-depth"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-gold/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-cream">
                    <span className="font-semibold">{activity.user.name}</span>{' '}
                    <span className="text-faint">
                      {activity.action === 'saved' && 'pinned'}
                      {activity.action === 'visited' && 'visited'}
                      {activity.action === 'reviewed' && 'reviewed'}
                      {activity.action === 'created_collection' && 'created'}
                    </span>
                  </p>
                  {activity.place && (
                    <p className="text-xs text-gold-soft font-medium truncate">{activity.place.name}</p>
                  )}
                  {activity.collectionName && (
                    <p className="text-xs text-violet font-medium">{activity.collectionName}</p>
                  )}
                </div>
                <span className="text-[10px] text-faint whitespace-nowrap">{activity.time}</span>
              </div>
              {activity.note && (
                <p className="text-xs text-muted mt-2.5 line-clamp-2 leading-relaxed">{activity.note}</p>
              )}
              {activity.photo && (
                <img src={activity.photo} alt="" className="w-full h-24 object-cover rounded-2xl mt-2.5" />
              )}
              {activity.rating && (
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: activity.rating }).map((_, i) => (
                    <span key={i} className="text-gold text-xs">★</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* picks */}
      <div className="mt-9 px-5">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-cream text-xl">
            {category === 'all'
              ? <>Trending with <em className="text-gold-gradient">friends</em></>
              : categories.find(c => c.id === category)?.label}
          </h2>
          <span className="text-xs text-faint">{filtered.length} places</span>
        </div>
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
            <p className="font-display text-cream text-lg">Uncharted territory</p>
            <p className="text-faint text-sm mt-1">Try a different search or category</p>
          </motion.div>
        )}
      </div>

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
