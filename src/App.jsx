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
  const { isSaved, toggleSave } = useSavedPlaces()

  return (
    <ToastProvider>
      <div className="max-w-lg mx-auto relative bg-warm-white min-h-screen shadow-2xl">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage isSaved={isSaved} toggleSave={toggleSave} />} />
            <Route path="/explore" element={<ExplorePage isSaved={isSaved} toggleSave={toggleSave} />} />
            <Route path="/collections" element={<CollectionsPage isSaved={isSaved} toggleSave={toggleSave} />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<ProfilePage isSaved={isSaved} />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </ToastProvider>
  )
}
