import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus, MapPin, Star, Heart, MessageCircle, Share2, X, Check } from 'lucide-react'
import { friends, activityFeed } from '../data/mockData'
import { useToast } from '../components/Toast'
import { useLang } from '../lib/i18n'

const suggestedUsers = [
  { id: 10, name: 'Mia Park', username: '@mia.p', initials: 'M', color: '#FB7185' },
  { id: 11, name: 'Luca Rossi', username: '@luca.r', initials: 'L', color: '#A78BFA' },
  { id: 12, name: 'Zoe Ng', username: '@zoe.n', initials: 'Z', color: '#5EEAD4' },
]

function AddFriendSheet({ isOpen, onClose }) {
  const showToast = useToast()
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [sent, setSent] = useState(new Set())

  const results = query.length > 1
    ? suggestedUsers.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
      )
    : suggestedUsers

  function sendRequest(user) {
    setSent(prev => new Set([...prev, user.id]))
    showToast({ message: t('toast.requestSent', { name: user.name }) })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[90] max-w-lg mx-auto bg-ink-2 rounded-t-[28px] max-h-[80vh] overflow-y-auto hairline-t shadow-pop"
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-cream">{t('fr.addSheet')}</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-ink-3 hairline flex items-center justify-center">
                  <X size={15} className="text-muted" />
                </button>
              </div>

              <div className="relative mb-5">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t('fr.searchUsers')}
                  aria-label={t('fr.searchUsers')}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-ink-3 hairline text-cream text-sm placeholder:text-faint outline-none focus:border-gold/30 transition-colors"
                />
              </div>

              <p className="text-[10px] font-semibold text-faint uppercase tracking-widest mb-3">
                {query.length > 1 ? t('fr.searchResults') : t('fr.suggestions')}
              </p>

              <div className="space-y-2">
                {results.map(user => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3.5 bg-ink-3/60 rounded-2xl hairline"
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base"
                      style={{ background: `${user.color}22`, color: user.color, boxShadow: `inset 0 0 0 1px ${user.color}50` }}
                    >
                      {user.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-cream text-sm">{user.name}</p>
                      <p className="text-faint text-xs">{user.username}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => sendRequest(user)}
                      disabled={sent.has(user.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        sent.has(user.id)
                          ? 'bg-mint/10 text-mint'
                          : 'btn-gold'
                      }`}
                    >
                      {sent.has(user.id) ? <><Check size={14} /> {t('fr.sent')}</> : <><UserPlus size={14} /> {t('fr.addBtn')}</>}
                    </motion.button>
                  </motion.div>
                ))}
                {results.length === 0 && (
                  <p className="text-center text-faint py-8 text-sm">{t('fr.noUsers', { q: query })}</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FriendCard({ friend }) {
  const showToast = useToast()
  const { t, pick } = useLang()
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-ink-2 rounded-3xl p-4 hairline shadow-depth cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10"
          />
          {friend.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-mint border-2 border-ink-2"
              style={{ boxShadow: '0 0 8px rgba(110,231,160,0.7)' }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-cream text-sm">{friend.name}</h3>
          <p className="text-faint text-xs">{friend.username}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => showToast({ message: t('toast.profileSoon', { name: friend.name }), type: 'info' })}
          className="px-3 py-1.5 bg-gold/10 text-gold-soft rounded-lg text-xs font-semibold border border-gold/20 hover:bg-gold/20 transition-colors"
        >
          {t('fr.view')}
        </motion.button>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 hairline-t">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-gold" />
          <span className="text-xs text-muted">{t('fr.saved', { n: friend.savedCount })}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={12} className="text-rose" />
          <span className="text-xs text-muted">{t('fr.mutual', { n: friend.mutualPlaces })}</span>
        </div>
      </div>

      <div className="mt-2.5 bg-ink-3/60 rounded-xl px-3 py-2">
        <p className="text-xs text-muted">
          <span className="text-faint">{pick(friend, 'recentTime')}:</span> {pick(friend, 'recentActivity')}
        </p>
      </div>
    </motion.div>
  )
}

function ActivityItem({ activity, index }) {
  const { t, pick } = useLang()
  return (
    <div className="flex gap-3">
      {/* timeline */}
      <div className="flex flex-col items-center">
        <img
          src={activity.user.avatar}
          alt={activity.user.name}
          className="w-10 h-10 rounded-full object-cover ring-1 ring-gold/25"
        />
        {index < activityFeed.length - 1 && (
          <div className="w-px flex-1 bg-gradient-to-b from-white/15 to-transparent mt-2" />
        )}
      </div>

      {/* content */}
      <div className="flex-1 pb-6">
        <div className="bg-ink-2 rounded-3xl p-4 hairline shadow-depth">
          <div className="flex items-center justify-between">
            <p className="text-sm text-cream">
              <span className="font-bold">{activity.user.name}</span>{' '}
              <span className="text-faint">
                {activity.action === 'saved' && t('fr.savedPlace')}
                {activity.action === 'visited' && t('fr.visitedPlace')}
                {activity.action === 'reviewed' && t('fr.reviewedPlace')}
                {activity.action === 'created_collection' && t('fr.createdCol')}
              </span>
            </p>
            <span className="text-[10px] text-faint">{pick(activity, 'time')}</span>
          </div>

          {activity.place && (
            <div className="flex items-center gap-3 mt-3 p-2.5 bg-ink-3/60 rounded-2xl">
              <img
                src={activity.place.image}
                alt={activity.place.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-cream text-sm truncate">{pick(activity.place, 'name')}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star size={11} className="fill-gold text-gold" />
                    <span className="text-xs text-cream/80">{activity.place.rating}</span>
                  </div>
                  <span className="text-xs text-faint">{pick(activity.place, 'cuisine') || activity.place.category}</span>
                </div>
              </div>
            </div>
          )}

          {activity.collectionName && (
            <div className="mt-2 px-3 py-2 bg-violet/10 border border-violet/20 rounded-2xl">
              <p className="text-sm font-medium text-violet">{pick(activity, 'collectionName')}</p>
            </div>
          )}

          {activity.note && (
            <p className="text-sm text-muted mt-2.5 leading-relaxed">{pick(activity, 'note')}</p>
          )}

          {activity.photo && (
            <img src={activity.photo} alt="" className="w-full h-40 object-cover rounded-2xl mt-3" />
          )}

          {activity.rating && (
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < activity.rating ? 'fill-gold text-gold' : 'text-white/15'}
                />
              ))}
            </div>
          )}

          <ActivityActions />
        </div>
      </div>
    </div>
  )
}

function ActivityActions() {
  const showToast = useToast()
  const { t } = useLang()
  const [liked, setLiked] = useState(false)
  return (
    <div className="flex items-center gap-4 mt-3 pt-3 hairline-t">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => { setLiked(v => !v); showToast({ message: liked ? t('toast.likeRemoved') : t('toast.likeAdded') }) }}
        className={`flex items-center gap-1 text-xs font-medium transition-colors ${liked ? 'text-gold' : 'text-faint hover:text-gold'}`}
      >
        <Heart size={14} className={liked ? 'fill-gold' : ''} /> {liked ? t('fr.liked') : t('fr.like')}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => showToast({ message: t('toast.comingSoon', { what: t('toast.commentsSoon') }), type: 'info' })}
        className="flex items-center gap-1 text-xs text-faint hover:text-skyblue transition-colors"
      >
        <MessageCircle size={14} /> {t('fr.comment')}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => showToast({ message: t('toast.linkCopied'), type: 'info' })}
        className="flex items-center gap-1 text-xs text-faint hover:text-mint transition-colors"
      >
        <Share2 size={14} /> {t('fr.share')}
      </motion.button>
    </div>
  )
}

export default function FriendsPage() {
  const showToast = useToast()
  const { t } = useLang()
  const [tab, setTab] = useState('feed')
  const [searchQuery, setSearchQuery] = useState('')
  const [addFriendOpen, setAddFriendOpen] = useState(false)

  const filteredFriends = useMemo(() =>
    friends.filter(f =>
      !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  )

  return (
    <div className="min-h-screen pb-32">
      {/* header */}
      <div className="px-5 pt-12 pb-3 sticky top-0 z-20 bg-ink/85 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl text-cream">{t('fr.title')}</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setAddFriendOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-sm font-semibold"
          >
            <UserPlus size={15} />
            {t('fr.add')}
          </motion.button>
        </div>

        {/* tabs */}
        <div className="flex gap-1 p-1 bg-ink-3/70 rounded-2xl hairline">
          {['feed', 'friends'].map(tab2 => (
            <button
              key={tab2}
              onClick={() => setTab(tab2)}
              className={`flex-1 relative py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === tab2 ? 'text-gold-soft' : 'text-faint'
              }`}
            >
              {tab === tab2 && (
                <motion.div
                  layoutId="friends-tab"
                  className="absolute inset-0 bg-gold/10 rounded-xl"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(239,179,92,0.25)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 capitalize">{tab2 === 'feed' ? t('fr.feed') : t('fr.myFriends')}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'feed' ? (
          <div key="feed" className="px-5 mt-4">
            {activityFeed.map((activity, i) => (
              <ActivityItem key={activity.id} activity={activity} index={i} />
            ))}
          </div>
        ) : (
          <div key="friends" className="px-5 mt-4">
            {/* search friends */}
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <input
                type="text"
                placeholder={t('fr.search')}
                aria-label={t('fr.search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-ink-3/70 hairline text-cream text-sm placeholder:text-faint outline-none focus:border-gold/30 transition-colors"
              />
            </div>

            {/* suggested */}
            <div className="mb-6">
              <h3 className="font-display text-cream text-lg mb-3">{t('fr.suggested')}</h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {suggestedUsers.map(user => (
                  <motion.div
                    key={user.id}
                    whileHover={{ y: -2 }}
                    className="flex-shrink-0 w-32 bg-ink-2 rounded-3xl p-4 hairline shadow-depth text-center"
                  >
                    <div
                      className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold"
                      style={{ background: `${user.color}22`, color: user.color, boxShadow: `inset 0 0 0 1px ${user.color}50` }}
                    >
                      {user.initials}
                    </div>
                    <p className="text-xs font-semibold text-cream truncate">{user.name}</p>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => showToast({ message: t('toast.requestSent', { name: user.name }) })}
                      className="mt-2 px-3 py-1.5 bg-gold/10 border border-gold/20 text-gold-soft rounded-lg text-xs font-semibold w-full"
                    >
                      {t('fr.follow')}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* friends list */}
            <h3 className="font-display text-cream text-lg mb-3">{t('fr.yourFriends', { n: filteredFriends.length })}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredFriends.map(friend => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      <AddFriendSheet isOpen={addFriendOpen} onClose={() => setAddFriendOpen(false)} />
    </div>
  )
}
