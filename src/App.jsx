import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import BottomNav from './components/BottomNav'
import { ToastProvider } from './components/Toast'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import CollectionsPage from './pages/CollectionsPage'
import FriendsPage from './pages/FriendsPage'
import ProfilePage from './pages/ProfilePage'
import { useSavedPlaces } from './hooks/useSavedPlaces'

export default function App() {
  const placesState = useSavedPlaces()

  return (
    <ToastProvider>
      <div className="max-w-lg mx-auto relative bg-ink text-cream min-h-screen ring-1 ring-white/5 shadow-[0_0_90px_rgba(0,0,0,0.85)]">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage {...placesState} />} />
            <Route path="/explore" element={<ExplorePage {...placesState} />} />
            <Route path="/collections" element={<CollectionsPage {...placesState} />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<ProfilePage {...placesState} />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </ToastProvider>
  )
}
