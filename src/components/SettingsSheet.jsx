import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Sunset, Shield, HelpCircle, LogOut, ChevronRight, Smartphone, Globe } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './Toast'
import { useLang } from '../lib/i18n'

export default function SettingsSheet({ isOpen, onClose }) {
  const showToast = useToast()
  const { t, lang, setLang } = useLang()
  const [notifications, setNotifications] = useState(true)

  function handle(labelKey) {
    if (labelKey === 'set.signOut') {
      showToast({ message: t('toast.signedOut'), type: 'info' })
      onClose()
    } else {
      showToast({ message: t('toast.comingSoon', { what: t(labelKey) }), type: 'info' })
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
            role="dialog"
            aria-label={t('set.title')}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-cream">{t('set.title')}</h2>
                <button aria-label="Close" onClick={onClose} className="w-9 h-9 rounded-full bg-ink-3 hairline flex items-center justify-center">
                  <X size={15} className="text-muted" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Language — Ukrainian is required by the UA language law, EN optional */}
                <div className="flex items-center gap-3 p-4 bg-ink-3/60 rounded-2xl hairline">
                  <div className="w-10 h-10 rounded-xl bg-skyblue/10 flex items-center justify-center">
                    <Globe size={18} className="text-skyblue" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-cream text-sm">{t('set.language')}</p>
                    <p className="text-faint text-xs">{t('set.languageSub')}</p>
                  </div>
                  <div className="flex gap-1 p-1 bg-ink rounded-xl hairline">
                    {[
                      { id: 'uk', label: 'УКР' },
                      { id: 'en', label: 'EN' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setLang(opt.id)}
                        aria-pressed={lang === opt.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          lang === opt.id
                            ? 'bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(239,179,92,0.35)]'
                            : 'text-faint'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications toggle */}
                <div className="flex items-center gap-3 p-4 bg-ink-3/60 rounded-2xl hairline">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                    <Bell size={18} className="text-amber" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-cream text-sm">{t('set.notifications')}</p>
                    <p className="text-faint text-xs">{t('set.notificationsSub')}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNotifications(v => !v)}
                    aria-pressed={notifications}
                    aria-label={t('set.notifications')}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors ${notifications ? 'bg-gold' : 'bg-white/10'}`}
                  >
                    <motion.div
                      animate={{ x: notifications ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-ink shadow-sm"
                    />
                  </motion.button>
                </div>

                {/* Appearance */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => showToast({ message: t('toast.lightTheme'), type: 'info' })}
                  className="w-full flex items-center gap-3 p-4 bg-ink-3/60 rounded-2xl hairline"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Sunset size={18} className="text-gold" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-cream text-sm">{t('set.appearance')}</p>
                    <p className="text-faint text-xs">{t('set.appearanceSub')}</p>
                  </div>
                  <ChevronRight size={16} className="text-faint" />
                </motion.button>

                {[
                  { icon: Shield, key: 'set.privacy', cls: 'text-skyblue', bg: 'bg-skyblue/10' },
                  { icon: Smartphone, key: 'set.appPrefs', cls: 'text-mint', bg: 'bg-mint/10' },
                  { icon: HelpCircle, key: 'set.help', cls: 'text-peach', bg: 'bg-peach/10' },
                ].map(({ icon: Icon, key, cls, bg }) => (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handle(key)}
                    className="w-full flex items-center gap-3 p-4 bg-ink-3/60 rounded-2xl hairline"
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={18} className={cls} />
                    </div>
                    <span className="flex-1 text-left font-semibold text-cream text-sm">{t(key)}</span>
                    <ChevronRight size={16} className="text-faint" />
                  </motion.button>
                ))}

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handle('set.signOut')}
                    className="w-full flex items-center gap-3 p-4 bg-rose/10 rounded-2xl border border-rose/20"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose/15 flex items-center justify-center">
                      <LogOut size={18} className="text-rose" />
                    </div>
                    <span className="flex-1 text-left font-semibold text-rose text-sm">{t('set.signOut')}</span>
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
