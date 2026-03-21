import { motion } from 'framer-motion'
import { categories } from '../data/mockData'

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange(cat.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
            active === cat.id
              ? 'bg-coral text-white shadow-lg shadow-coral/25'
              : 'bg-white text-navy hover:bg-peach-light/30 border border-sand/60'
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
