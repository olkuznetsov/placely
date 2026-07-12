import { NavLink } from 'react-router-dom'
import { Home, Compass, FolderHeart, Users, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLang } from '../lib/i18n'

const navItems = [
  { to: '/', icon: Home, key: 'nav.home' },
  { to: '/explore', icon: Compass, key: 'nav.explore' },
  { to: '/collections', icon: FolderHeart, key: 'nav.saved' },
  { to: '/friends', icon: Users, key: 'nav.friends' },
  { to: '/profile', icon: User, key: 'nav.profile' },
]

export default function BottomNav() {
  const { t } = useLang()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-[max(env(safe-area-inset-bottom),0.75rem)] px-5">
      <div className="pointer-events-auto max-w-md mx-auto glass-panel shadow-pop rounded-[26px] flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            aria-label={t(key)}
            className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-2xl bg-gold/10"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(239,179,92,0.25), 0 0 20px -6px rgba(239,179,92,0.5)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <motion.div whileTap={{ scale: 0.82 }} className="relative z-10">
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.4 : 1.7}
                    className={`transition-colors duration-200 ${isActive ? 'text-gold' : 'text-faint'}`}
                  />
                </motion.div>
                <span className={`relative z-10 text-[9.5px] font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-gold-soft' : 'text-faint'
                }`}>
                  {t(key)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
