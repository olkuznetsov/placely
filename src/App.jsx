import { useEffect, useState } from 'react'
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
import { LanguageProvider, useLang } from './lib/i18n'
import { PlacesProvider } from './context/PlacesContext'
import AddPlaceSheet from './components/AddPlaceSheet'
import { Plus } from 'lucide-react'

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

function AddPlaceFab({ onOpen }) {
  const { t } = useLang()
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onOpen}
      aria-label={t('add.fab')}
      className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full btn-gold flex items-center justify-center shadow-pop"
    >
      <Plus size={24} strokeWidth={2.6} />
    </motion.button>
  )
}

export default function App() {
  const placesState = useSavedPlaces()
  const location = useLocation()
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
      <PlacesProvider>
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
          <AddPlaceFab onOpen={() => setAddOpen(true)} />
          <AddPlaceSheet
            isOpen={addOpen}
            onClose={() => setAddOpen(false)}
            onAdded={(place) => { if (!placesState.isSaved(place.id)) placesState.toggleSave(place.id) }}
          />
          <BottomNav />
        </div>
      </ToastProvider>
      </PlacesProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}
