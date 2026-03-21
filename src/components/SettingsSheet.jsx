import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, Sun, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './Toast'

export default function SettingsSheet({ isOpen, onClose }) {
  const showToast = useToast()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  function handle(label) {
    if (label === 'Sign Out') {
      showToast({ message: 'Signed out successfully', type: 'info' })
      onClose()
    } else {
      showToast({ message: `${label} — coming soon!`, type: 'info' })
    }
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
            className="fixed bottom-0 left-0 right-0 z-[90] bg-warm-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-sand" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-navy">Settings</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-sand/40 flex items-center justify-center">
                  <X size={16} className="text-slate" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Notifications toggle */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand/40">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                    <Bell size={18} className="text-amber" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-navy text-sm">Notifications</p>
                    <p className="text-warm-gray text-xs">Friend activity, saves, reminders</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNotifications(v => !v)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors ${notifications ? 'bg-coral' : 'bg-sand'}`}
                  >
                    <motion.div
                      animate={{ x: notifications ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-sm"
                    />
                  </motion.button>
                </div>

                {/* Dark mode toggle */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand/40">
                  <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
                    {darkMode ? <Moon size={18} className="text-navy" /> : <Sun size={18} className="text-amber" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-navy text-sm">Dark Mode</p>
                    <p className="text-warm-gray text-xs">Easy on the eyes at night</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setDarkMode(v => !v); showToast({ message: 'Dark mode coming soon!', type: 'info' }) }}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-navy' : 'bg-sand'}`}
                  >
                    <motion.div
                      animate={{ x: darkMode ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-sm"
                    />
                  </motion.button>
                </div>

                {[
                  { icon: Shield, label: 'Privacy & Data', color: 'sky', bg: 'bg-sky/10' },
                  { icon: Smartphone, label: 'App Preferences', color: 'mint', bg: 'bg-mint/10' },
                  { icon: HelpCircle, label: 'Help & Support', color: 'lavender', bg: 'bg-lavender/10' },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handle(label)}
                    className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand/40"
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={18} style={{ color: `var(--color-${color})` }} />
                    </div>
                    <span className="flex-1 text-left font-semibold text-navy text-sm">{label}</span>
                    <ChevronRight size={16} className="text-warm-gray" />
                  </motion.button>
                ))}

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handle('Sign Out')}
                    className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <LogOut size={18} className="text-red-400" />
                    </div>
                    <span className="flex-1 text-left font-semibold text-red-400 text-sm">Sign Out</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
