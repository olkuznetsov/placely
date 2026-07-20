import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Settings, MapPin, Eye, FolderHeart, Users, Flame, ChevronRight, Edit3 } from 'lucide-react'
import { userProfile, collections, categoryMeta } from '../data/mockData'
import { usePlaces } from '../context/PlacesContext'
import { categoryIcons } from '../lib/icons'
import { useToast } from '../components/Toast'
import SettingsSheet from '../components/SettingsSheet'
import { useLang } from '../lib/i18n'

// small deterministic star field for the header
const STARS = Array.from({ length: 24 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 733 + n * 51.3) * 10000
    return x - Math.floor(x)
  }
  return {
    left: `${(r(1) * 94 + 3).toFixed(2)}%`,
    top: `${(r(2) * 80 + 5).toFixed(2)}%`,
    size: 1 + r(3) * 1.5,
    delay: `${(r(4) * 4).toFixed(2)}s`,
    dur: `${(2.5 + r(5) * 3).toFixed(2)}s`,
  }
})

const statStyles = {
  gold:   { bg: 'bg-gold/10',    text: 'text-gold' },
  mint:   { bg: 'bg-mint/10',    text: 'text-mint' },
  sky:    { bg: 'bg-skyblue/10', text: 'text-skyblue' },
  violet: { bg: 'bg-violet/10',  text: 'text-violet' },
}

function StatCard({ icon: Icon, value, label, color }) {
  const { bg, text } = statStyles[color] || statStyles.gold
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-ink-2 rounded-2xl p-3 hairline shadow-depth text-center"
    >
      <div className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center ${bg}`}>
        <Icon size={15} className={text} />
      </div>
      <p className="text-lg font-bold text-cream">{value}</p>
      <p className="text-[10px] text-faint mt-0.5 tracking-wide">{label}</p>
    </motion.div>
  )
}

/** passport-stamp badge — dashed ring, slight tilt, gold ink */
function StampBadge({ badge, index }) {
  const showToast = useToast()
  const { pick } = useLang()
  const tilts = [-4, 3, -2, 5]
  return (
    <motion.div
      whileHover={{ scale: 1.06, rotate: 0 }}
      whileTap={{ scale: 0.95 }}
      initial={{ rotate: tilts[index % 4] }}
      onClick={() => showToast({ message: `${pick(badge, 'name')}: ${pick(badge, 'description')}`, type: 'info' })}
      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl cursor-pointer border border-dashed border-gold/30 bg-gold/[0.04]"
    >
      <span className="text-2xl" style={{ filter: 'sepia(0.4) saturate(1.2)' }}>{badge.emoji}</span>
      <p className="text-[11px] font-semibold text-gold-soft text-center leading-tight">{pick(badge, 'name')}</p>
      <p className="text-[9px] text-faint text-center leading-tight">{pick(badge, 'description')}</p>
    </motion.div>
  )
}

export default function ProfilePage({ isSaved, visitedIds }) {
  const showToast = useToast()
  const { t, pick } = useLang()
  const { allPlaces } = usePlaces()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const savedCount = useMemo(() => allPlaces.filter(p => isSaved(p.id)).length, [allPlaces, isSaved])
  const visitedCount = visitedIds.size

  const pct = savedCount > 0 ? Math.min(visitedCount / savedCount, 1) : 0
  const R = 42
  const C = 2 * Math.PI * R

  return (
    <div className="min-h-screen pb-32">
      {/* night-sky header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F26] via-ink-sky to-ink" />
        {STARS.map((s, i) => (
          <div
            key={i}
            className="star absolute rounded-full bg-cream"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, '--delay': s.delay, '--dur': s.dur }}
          />
        ))}
        <div className="absolute -left-14 top-8 w-56 h-40 rounded-full opacity-20 animate-drift"
          style={{ background: 'radial-gradient(ellipse at center, #A78BFA 0%, transparent 70%)', filter: 'blur(44px)' }}
        />

        <div className="relative z-10 px-5 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="font-display italic text-lg text-gold-gradient">{t('pr.passport')}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSettingsOpen(true)}
              className="w-9 h-9 rounded-full glass-chip flex items-center justify-center"
            >
              <Settings size={17} className="text-cream/90" />
            </motion.button>
          </div>

          <div className="flex items-center gap-5">
            {/* avatar wrapped in the journey ring */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r={R} fill="none"
                  stroke="url(#profileRing)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
                  style={{ filter: 'drop-shadow(0 0 5px rgba(239,179,92,0.55))' }}
                />
                <defs>
                  <linearGradient id="profileRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F7D398" />
                    <stop offset="100%" stopColor="#D89A47" />
                  </linearGradient>
                </defs>
              </svg>
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="absolute inset-2.5 w-[calc(100%-1.25rem)] h-[calc(100%-1.25rem)] rounded-full object-cover"
              />
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => showToast({ message: t('toast.comingSoon', { what: t('toast.editSoon') }), type: 'info' })}
                className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full btn-gold flex items-center justify-center"
              >
                <Edit3 size={11} />
              </motion.button>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl text-cream leading-tight">{userProfile.name}</h1>
              <p className="text-faint text-sm">{userProfile.username}</p>
              <p className="text-muted text-sm mt-1.5 leading-snug">{pick(userProfile, 'bio')}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <div className="inline-flex items-center gap-2 glass-chip rounded-2xl px-3.5 py-2">
              <Flame size={15} className="text-gold" />
              <span className="text-gold-soft font-semibold text-xs">{t('pr.streak', { n: userProfile.streak })}</span>
            </div>
            <div className="inline-flex items-center gap-2 glass-chip rounded-2xl px-3.5 py-2">
              <span className="text-cream/90 font-semibold text-xs">
                {t('pr.dreams', { x: visitedCount, y: savedCount })}
              </span>
              <span className="text-gold text-xs font-bold">{Math.round(pct * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-4 gap-2">
          <StatCard icon={MapPin}      value={savedCount}          label={t('pr.pinned')}  color="gold" />
          <StatCard icon={Eye}         value={visitedCount}        label={t('pr.lived')}   color="mint" />
          <StatCard icon={FolderHeart} value={collections.length}  label={t('pr.lists')}   color="sky" />
          <StatCard icon={Users}       value={userProfile.friendCount} label={t('pr.friends')} color="violet" />
        </div>
      </div>

      {/* stamps */}
      <div className="mt-7 px-5">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display text-cream text-xl">{t('pr.stamps')}</h2>
          <button
            onClick={() => showToast({ message: t('toast.comingSoon', { what: t('toast.allStamps') }), type: 'info' })}
            className="text-gold-soft text-xs font-semibold flex items-center gap-0.5 tracking-wide"
          >
            {t('pr.all')} <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {userProfile.badges.map((badge, i) => (
            <StampBadge key={badge.id} badge={badge} index={i} />
          ))}
        </div>
      </div>

      {/* top categories */}
      <div className="mt-7 px-5">
        <h2 className="font-display text-cream text-xl mb-3">{t('pr.drawnTo')}</h2>
        <div className="flex gap-2 flex-wrap">
          {userProfile.topCategories.map(cat => {
            const meta = categoryMeta[cat]
            const Icon = meta ? categoryIcons[meta.icon] : MapPin
            return (
              <div
                key={cat}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm border"
                style={{
                  color: meta?.color,
                  borderColor: `${meta?.color}40`,
                  background: `${meta?.color}12`,
                }}
              >
                {Icon && <Icon size={15} />}
                <span>{meta ? pick(meta, 'label') : cat}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* settings shortcut */}
      <div className="mt-7 px-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center gap-4 p-4 bg-ink-2 rounded-2xl hairline shadow-depth"
        >
          <div className="w-10 h-10 rounded-xl bg-ink-3 flex items-center justify-center">
            <Settings size={17} className="text-muted" />
          </div>
          <span className="flex-1 text-left font-semibold text-cream text-sm">{t('pr.settings')}</span>
          <ChevronRight size={16} className="text-faint" />
        </motion.button>
      </div>

      <p className="text-center text-faint text-xs mt-7 mb-4 font-display italic">
        {t('pr.since', { date: pick(userProfile, 'joinDate') })}
      </p>

      <SettingsSheet isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
