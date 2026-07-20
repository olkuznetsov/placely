import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, MapPin, Plus, Check, Loader2 } from 'lucide-react'
import { categoryMeta } from '../data/mockData'
import { categoryIcons } from '../lib/icons'
import { searchPlaces, toPlace } from '../lib/osm'
import { usePlaces } from '../context/PlacesContext'
import { useToast } from './Toast'
import { useLang } from '../lib/i18n'
import { buzz } from '../lib/haptics'

export default function AddPlaceSheet({ isOpen, onClose, onAdded }) {
  const { t, lang } = useLang()
  const { addPlace, myPlaces } = usePlaces()
  const showToast = useToast()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const abortRef = useRef(null)

  // debounced Nominatim search (usage policy: ≤1 req/s)
  useEffect(() => {
    if (!isOpen) return undefined
    abortRef.current?.abort()
    if (query.trim().length < 3) {
      setResults([])
      setSearched(false)
      setLoading(false)
      return undefined
    }
    setLoading(true)
    const ctl = new AbortController()
    abortRef.current = ctl
    const timer = setTimeout(() => {
      searchPlaces(query.trim(), lang, ctl.signal)
        .then(rows => { setResults(rows); setSearched(true); setLoading(false) })
        .catch(err => { if (err.name !== 'AbortError') { setResults([]); setSearched(true); setLoading(false) } })
    }, 550)
    return () => { clearTimeout(timer); ctl.abort() }
  }, [query, isOpen, lang])

  useEffect(() => {
    if (!isOpen) { setQuery(''); setResults([]); setSearched(false) }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const alreadyAdded = (osmId) => myPlaces.some(p => p.id === `u_${osmId}`)

  function handleAdd(result) {
    const place = toPlace(result)
    buzz()
    addPlace(place)
    onAdded?.(place)
    showToast({ message: t('add.added', { name: place.name }) })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[90] max-w-lg mx-auto bg-ink-2 rounded-t-[28px] h-[78vh] overflow-y-auto hairline-t shadow-pop"
            role="dialog"
            aria-label={t('add.title')}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="font-display text-2xl text-cream">{t('add.title')}</h2>
                <button aria-label="Close" onClick={onClose} className="w-9 h-9 rounded-full bg-ink-3 hairline flex items-center justify-center">
                  <X size={15} className="text-muted" />
                </button>
              </div>
              <p className="text-faint text-xs mb-4">{t('add.hint')}</p>

              <div className="relative mb-4">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t('add.search')}
                  aria-label={t('add.search')}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-ink-3 hairline text-cream text-sm placeholder:text-faint outline-none focus:border-gold/30 transition-colors"
                />
                {loading && (
                  <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold animate-spin" />
                )}
              </div>

              <div className="space-y-2">
                {results.map(r => {
                  const meta = categoryMeta[r.category]
                  const Icon = meta ? categoryIcons[meta.icon] : MapPin
                  const added = alreadyAdded(r.osmId)
                  return (
                    <motion.button
                      key={r.osmId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={added}
                      onClick={() => handleAdd(r)}
                      className="w-full flex items-center gap-3 p-3.5 bg-ink-3/60 rounded-2xl border border-white/[0.06] hover:border-gold/30 transition-colors text-left"
                    >
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${meta?.color ?? '#EFB35C'}1C`, boxShadow: `inset 0 0 0 1px ${meta?.color ?? '#EFB35C'}40` }}
                      >
                        {Icon && <Icon size={17} style={{ color: meta?.color ?? '#EFB35C' }} />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-cream text-sm truncate">{r.name}</span>
                        <span className="block text-faint text-xs truncate">{r.address}</span>
                      </span>
                      {added
                        ? <Check size={17} className="text-mint shrink-0" />
                        : <Plus size={17} className="text-gold shrink-0" />}
                    </motion.button>
                  )
                })}

                {searched && !loading && results.length === 0 && (
                  <p className="text-center text-faint py-10 text-sm">{t('add.noResults', { q: query })}</p>
                )}

                {!searched && !loading && (
                  <div className="text-center py-10">
                    <MapPin size={26} className="mx-auto text-faint mb-2" />
                    <p className="text-faint text-sm">{t('add.empty')}</p>
                  </div>
                )}
              </div>

              <p className="text-center text-faint/60 text-[10px] mt-6">{t('add.credit')}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
