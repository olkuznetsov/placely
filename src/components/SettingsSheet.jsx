import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './Toast'

export default function SettingsSheet({ isOpen, onClose }) {
  const showToast = useToast()
  const [nightMode] = useState(true)
  const [notifications, setNotifications] = useState(true)

  function handle(label) {
    if (label === 'Sign Out') {
      showToast({ message: 'Signed out successfully', type: 'info' })
      onClose()
    } else {
      showToast({ message: `${label} — coming soon`, type: 'info' })
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[90] max-w-lg mx-auto bg-ink-2 rounded-t-[28px] max-h-[85vh] overflow-y-auto hairline-t shadow-pop"
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-cream">Settings</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-ink-3 hairline flex items-center justify-center">
                  <X size={15} className="text-muted" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Notifications toggle */}
                <div className="flex items-center gap-3 p-4 bg-ink-3/60 rounded-2xl hairline">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                    <Bell size={18} className="text-amber" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-cream text-sm">Notifications</p>
                    <p className="text-faint text-xs">Friend activity, saves, reminders</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNotifications(v => !v)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors ${notifications ? 'bg-gold' : 'bg-white/10'}`}
                  >
                    <motion.div
                      animate={{ x: notifications ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-ink shadow-sm"
                    />
                  </motion.button>
                </div>

                {/* Night mode — always on, it's the whole point */}
                <div className="flex items-center gap-3 p-4 bg-ink-3/60 rounded-2xl hairline">
                  <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                    <Moon size={18} className="text-violet" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-cream text-sm">Night Atlas mode</p>
                    <p className="text-faint text-xs">Always on — stars only come out at night</p>
                  </div>
                  <div className="w-12 h-6 rounded-full p-0.5 bg-violet/60 opacity-70">
                    <div className="w-5 h-5 rounded-full bg-ink translate-x-6" />
                  </div>
                </div>

                {[
                  { icon: Shield, label: 'Privacy & Data', cls: 'text-skyblue', bg: 'bg-skyblue/10' },
                  { icon: Smartphone, label: 'App Preferences', cls: 'text-mint', bg: 'bg-mint/10' },
                  { icon: HelpCircle, label: 'Help & Support', cls: 'text-peach', bg: 'bg-peach/10' },
                ].map(({ icon: Icon, label, cls, bg }) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handle(label)}
                    className="w-full flex items-center gap-3 p-4 bg-ink-3/60 rounded-2xl hairline"
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={18} className={cls} />
                    </div>
                    <span className="flex-1 text-left font-semibold text-cream text-sm">{label}</span>
                    <ChevronRight size={16} className="text-faint" />
                  </motion.button>
                ))}

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handle('Sign Out')}
                    className="w-full flex items-center gap-3 p-4 bg-rose/10 rounded-2xl border border-rose/20"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose/15 flex items-center justify-center">
                      <LogOut size={18} className="text-rose" />
                    </div>
                    <span className="flex-1 text-left font-semibold text-rose text-sm">Sign Out</span>
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
