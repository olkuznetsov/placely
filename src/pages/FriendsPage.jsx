import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus, MapPin, Star, Heart, MessageCircle, Share2, X, Check } from 'lucide-react'
import { friends, activityFeed } from '../data/mockData'
import { useToast } from '../components/Toast'

const suggestedUsers = [
  { id: 10, name: 'Mia Park', username: '@mia.p', initials: 'M', color: 'from-coral to-peach' },
  { id: 11, name: 'Luca Rossi', username: '@luca.r', initials: 'L', color: 'from-sky to-lavender' },
  { id: 12, name: 'Zoe Ng', username: '@zoe.n', initials: 'Z', color: 'from-mint to-sky' },
]

function AddFriendSheet({ isOpen, onClose }) {
  const showToast = useToast()
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
    showToast({ message: `Friend request sent to ${user.name}!` })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[90] bg-warm-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-sand" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy">Add Friends</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-sand/40 flex items-center justify-center">
                  <X size={16} className="text-slate" />
                </button>
              </div>

              <div className="relative mb-5">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name or username..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-sand/30 text-navy text-sm placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-coral/30"
                />
              </div>

              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wide mb-3">
                {query.length > 1 ? 'Search Results' : 'Suggested'}
              </p>

              <div className="space-y-2">
                {results.map(user => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-sand/40"
                  >
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold text-base`}>
                      {user.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-navy text-sm">{user.name}</p>
                      <p className="text-warm-gray text-xs">{user.username}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => sendRequest(user)}
                      disabled={sent.has(user.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        sent.has(user.id)
                          ? 'bg-mint/10 text-mint'
                          : 'bg-coral text-white shadow-md shadow-coral/20'
                      }`}
                    >
                      {sent.has(user.id) ? <><Check size={14} /> Sent</> : <><UserPlus size={14} /> Add</>}
                    </motion.button>
                  </motion.div>
                ))}
                {results.length === 0 && (
                  <p className="text-center text-warm-gray py-8 text-sm">No users found for "{query}"</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FriendCard({ friend, index }) {
  const showToast = useToast()
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-sand/40 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {friend.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-mint border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-navy text-sm">{friend.name}</h3>
          <p className="text-warm-gray text-xs">{friend.username}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => showToast({ message: `${friend.name}'s profile — coming soon!`, type: 'info' })}
          className="px-3 py-1.5 bg-coral/10 text-coral rounded-lg text-xs font-semibold hover:bg-coral/20 transition-colors"
        >
          View
        </motion.button>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sand/30">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-coral" />
          <span className="text-xs text-slate">{friend.savedCount} saved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={12} className="text-coral" />
          <span className="text-xs text-slate">{friend.mutualPlaces} mutual</span>
        </div>
      </div>

      <div className="mt-2.5 bg-cream/60 rounded-lg px-3 py-2">
        <p className="text-xs text-slate">
          <span className="text-warm-gray">{friend.recentTime}:</span> {friend.recentActivity}
        </p>
      </div>
    </motion.div>
  )
}

function ActivityItem({ activity, index }) {
  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <img
          src={activity.user.avatar}
          alt={activity.user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
        {index < activityFeed.length - 1 && (
          <div className="w-0.5 flex-1 bg-sand/50 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand/30">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              <span className="font-bold text-navy">{activity.user.name}</span>{' '}
              <span className="text-warm-gray">
                {activity.action === 'saved' && 'saved a place'}
                {activity.action === 'visited' && 'visited'}
                {activity.action === 'reviewed' && 'reviewed'}
                {activity.action === 'created_collection' && 'created a collection'}
              </span>
            </p>
            <span className="text-[11px] text-warm-gray">{activity.time}</span>
          </div>

          {activity.place && (
            <div className="flex items-center gap-3 mt-3 p-2.5 bg-cream/50 rounded-xl">
              <img
                src={activity.place.image}
                alt={activity.place.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy text-sm truncate">{activity.place.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star size={11} className="fill-amber text-amber" />
                    <span className="text-xs text-navy">{activity.place.rating}</span>
                  </div>
                  <span className="text-xs text-warm-gray">{activity.place.cuisine || activity.place.category}</span>
                </div>
              </div>
            </div>
          )}

          {activity.collectionName && (
            <div className="mt-2 px-3 py-2 bg-lavender/10 rounded-xl">
              <p className="text-sm font-medium text-lavender">{activity.collectionName}</p>
            </div>
          )}

          {activity.note && (
            <p className="text-sm text-slate mt-2.5 leading-relaxed">{activity.note}</p>
          )}

          {activity.photo && (
            <img
              src={activity.photo}
              alt=""
              className="w-full h-40 object-cover rounded-xl mt-3"
            />
          )}

          {activity.rating && (
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < activity.rating ? 'fill-amber text-amber' : 'text-sand'}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <ActivityActions />
        </div>
      </div>
    </div>
  )
}

function ActivityActions() {
  const showToast = useToast()
  const [liked, setLiked] = useState(false)
  return (
    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sand/30">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => { setLiked(v => !v); showToast({ message: liked ? 'Like removed' : 'Liked!' }) }}
        className={`flex items-center gap-1 text-xs font-medium transition-colors ${liked ? 'text-coral' : 'text-warm-gray hover:text-coral'}`}
      >
        <Heart size={14} className={liked ? 'fill-coral' : ''} /> {liked ? 'Liked' : 'Like'}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => showToast({ message: 'Comments — coming soon!', type: 'info' })}
        className="flex items-center gap-1 text-xs text-warm-gray hover:text-sky transition-colors"
      >
        <MessageCircle size={14} /> Comment
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => showToast({ message: 'Link copied!', type: 'info' })}
        className="flex items-center gap-1 text-xs text-warm-gray hover:text-mint transition-colors"
      >
        <Share2 size={14} /> Share
      </motion.button>
    </div>
  )
}

export default function FriendsPage() {
  const showToast = useToast()
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
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 bg-warm-white sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-navy">Friends</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setAddFriendOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-coral text-white rounded-xl text-sm font-medium shadow-lg shadow-coral/20"
          >
            <UserPlus size={16} />
            Add Friend
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-sand/30 rounded-xl">
          {['feed', 'friends'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 relative py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'text-navy' : 'text-warm-gray'
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="friends-tab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 capitalize">{t === 'feed' ? 'Activity Feed' : 'My Friends'}</span>
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
            {/* Search friends */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-sand/30 text-navy text-sm placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>

            {/* Suggested */}
            <div className="mb-6">
              <h3 className="font-semibold text-navy text-sm mb-3">Suggested for you</h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    className="flex-shrink-0 w-32 bg-white rounded-2xl p-4 border border-sand/40 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-coral to-peach mx-auto mb-2 flex items-center justify-center text-white text-lg font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <p className="text-xs font-semibold text-navy">New Friend</p>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => showToast({ message: 'Friend request sent!' })}
                      className="mt-2 px-3 py-1 bg-coral/10 text-coral rounded-lg text-xs font-semibold w-full"
                    >
                      Follow
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Friends list */}
            <h3 className="font-semibold text-navy text-sm mb-3">Your Friends ({filteredFriends.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredFriends.map((friend, i) => (
                <FriendCard key={friend.id} friend={friend} index={i} />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      <AddFriendSheet isOpen={addFriendOpen} onClose={() => setAddFriendOpen(false)} />
    </div>
  )
}
