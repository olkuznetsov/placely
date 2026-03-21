import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { collections } from '../data/mockData'
import { useToast } from './Toast'

export default function AddToCollectionModal({ place, isOpen, onClose }) {
  const showToast = useToast()
  const [added, setAdded] = useState(new Set())
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  function handleAdd(collection) {
    setAdded(prev => new Set([...prev, collection.id]))
    showToast({ message: `Added to "${collection.name}"` })
  }

  function handleCreate() {
    if (!newName.trim()) return
    showToast({ message: `Collection "${newName}" created!` })
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
            className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[90] bg-warm-white rounded-t-3xl max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-sand" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy">Save to Collection</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-sand/40 flex items-center justify-center">
                  <X size={16} className="text-slate" />
                </button>
              </div>

              {place && (
                <div className="flex items-center gap-3 mb-5 p-3 bg-cream rounded-xl">
                  <img src={place.image} alt={place.name} className="w-12 h-12 rounded-lg object-cover" />
                  <p className="font-semibold text-navy text-sm">{place.name}</p>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {collections.map(col => (
                  <motion.button
                    key={col.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAdd(col)}
                    className="w-full flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-sand/50 hover:border-coral/30 transition-colors"
                  >
                    <span className="text-2xl">{col.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-navy text-sm">{col.name}</p>
                      <p className="text-warm-gray text-xs">{col.placeIds.length} places</p>
                    </div>
                    {added.has(col.id) ? (
                      <Check size={18} className="text-mint" />
                    ) : (
                      <Plus size={18} className="text-warm-gray" />
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
                    placeholder="Collection name..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-sand bg-white text-navy text-sm outline-none focus:border-coral transition-colors"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCreate}
                    className="px-4 py-2.5 bg-coral text-white rounded-xl font-semibold text-sm"
                  >
                    Create
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCreating(true)}
                  className="w-full flex items-center gap-3 p-3.5 border-2 border-dashed border-sand rounded-2xl hover:border-coral/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-peach-light/30 flex items-center justify-center">
                    <Plus size={18} className="text-coral" />
                  </div>
                  <span className="font-medium text-slate text-sm">New Collection</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
