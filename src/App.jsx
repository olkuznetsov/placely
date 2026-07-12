import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import { ToastProvider } from './components/Toast'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import CollectionsPage from './pages/CollectionsPage'
import FriendsPage from './pages/FriendsPage'
import ProfilePage from './pages/ProfilePage'
import { useSavedPlaces } from './hooks/useSavedPlaces'

/** Depth-aware page transition: pages settle in from slightly behind the glass */
function PageShell({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.012, y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ transformOrigin: '50% 30%' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const placesState = useSavedPlaces()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <div className="max-w-lg mx-auto relative bg-ink text-cream min-h-screen ring-1 ring-white/5 shadow-[0_0_90px_rgba(0,0,0,0.85)]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageShell><HomePage {...placesState} /></PageShell>} />
              <Route path="/explore" element={<PageShell><ExplorePage {...placesState} /></PageShell>} />
              <Route path="/collections" element={<PageShell><CollectionsPage {...placesState} /></PageShell>} />
              <Route path="/friends" element={<PageShell><FriendsPage /></PageShell>} />
              <Route path="/profile" element={<PageShell><ProfilePage {...placesState} /></PageShell>} />
            </Routes>
          </AnimatePresence>
          <BottomNav />
        </div>
      </ToastProvider>
    </MotionConfig>
  )
}
