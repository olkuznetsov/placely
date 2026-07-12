import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { collections } from '../data/mockData'
import { useToast } from './Toast'
import { useLang } from '../lib/i18n'

export default function AddToCollectionModal({ place, isOpen, onClose }) {
  const showToast = useToast()
  const { t, pick } = useLang()
  const [added, setAdded] = useState(new Set())
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  // fresh state per place — checkmarks from one place shouldn't leak to another
  useEffect(() => {
    setAdded(new Set())
    setCreating(false)
    setNewName('')
  }, [place?.id])

  function handleAdd(collection) {
    setAdded(prev => new Set([...prev, collection.id]))
    showToast({ message: t('toast.addedTo', { name: pick(collection, 'name') }) })
  }

  function handleCreate() {
    if (!newName.trim()) return
    showToast({ message: t('toast.colCreated', { name: newName }) })
    setNewName('')
    setCreating(false)
    onClose()
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
            className="fixed bottom-0 left-0 right-0 z-[90] max-w-lg mx-auto bg-ink-2 rounded-t-[28px] max-h-[70vh] overflow-y-auto hairline-t shadow-pop"
            role="dialog"
            aria-label={t('cm.title')}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-cream">{t('cm.title')}</h2>
                <button aria-label="Close" onClick={onClose} className="w-9 h-9 rounded-full bg-ink-3 hairline flex items-center justify-center">
                  <X size={15} className="text-muted" />
                </button>
              </div>

              {place && (
                <div className="flex items-center gap-3 mb-5 p-3 bg-ink-3/70 hairline rounded-2xl">
                  <img src={place.image} alt={pick(place, 'name')} className="w-12 h-12 rounded-xl object-cover" />
                  <p className="font-semibold text-cream text-sm">{pick(place, 'name')}</p>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {collections.map(col => (
                  <motion.button
                    key={col.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAdd(col)}
                    className="w-full flex items-center gap-3 p-3.5 bg-ink-3/60 rounded-2xl border border-white/[0.06] hover:border-gold/30 transition-colors"
                  >
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: `${col.color}1F`, boxShadow: `inset 0 0 0 1px ${col.color}40` }}
                    >
                      {col.emoji}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-cream text-sm">{pick(col, 'name')}</p>
                      <p className="text-faint text-xs">{t('cm.places', { n: col.placeIds.length })}</p>
                    </div>
                    {added.has(col.id) ? (
                      <Check size={18} className="text-mint" />
                    ) : (
                      <Plus size={18} className="text-faint" />
                    )}
                  </motion.button>
                ))}
              </div>

              {creating ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder={t('cm.name')}
                    aria-label={t('cm.name')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-ink-3 hairline text-cream text-sm placeholder:text-faint outline-none focus:border-gold/40 transition-colors"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCreate}
                    className="px-4 py-2.5 btn-gold rounded-xl font-semibold text-sm"
                  >
                    {t('cm.create')}
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCreating(true)}
                  className="w-full flex items-center gap-3 p-3.5 border-2 border-dashed border-white/10 rounded-2xl hover:border-gold/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Plus size={18} className="text-gold" />
                  </div>
                  <span className="font-medium text-muted text-sm">{t('cm.newCollection')}</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
