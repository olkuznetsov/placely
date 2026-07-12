import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const timers = useRef(new Map())

  useEffect(() => {
    return () => timers.current.forEach(t => clearTimeout(t))
  }, [])

  const showToast = useCallback(({ message, type = 'success', duration = 2500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts(prev => [...prev, { id, message, type }])
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      timers.current.delete(id)
    }, duration)
    timers.current.set(id, timer)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) { clearTimeout(timer); timers.current.delete(id) }
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed top-6 left-0 right-0 z-[200] flex flex-col items-center gap-2 pointer-events-none px-5">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel shadow-pop max-w-sm w-full"
            >
              {toast.type === 'success'
                ? <CheckCircle size={18} className="text-gold shrink-0" />
                : <Info size={18} className="text-skyblue shrink-0" />
              }
              <span className="text-sm font-medium flex-1 text-cream">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} className="text-faint hover:text-cream transition-colors">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
