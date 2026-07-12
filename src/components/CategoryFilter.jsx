import { motion } from 'framer-motion'
import { categories } from '../data/mockData'
import { categoryIcons } from '../lib/icons'
import { useLang } from '../lib/i18n'

export default function CategoryFilter({ active, onChange }) {
  const { pick } = useLang()
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3" role="tablist">
      {categories.map((cat) => {
        const Icon = categoryIcons[cat.icon]
        const isActive = active === cat.id
        return (
          <motion.button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap text-[13px] font-medium transition-all duration-200 border ${
              isActive ? 'font-semibold' : 'bg-ink-3/60 border-white/[0.06] text-muted hover:text-cream'
            }`}
            style={isActive ? {
              color: cat.color,
              borderColor: `${cat.color}66`,
              background: `${cat.color}1A`,
              boxShadow: `0 0 16px -4px ${cat.color}55`,
            } : undefined}
          >
            {Icon && <Icon size={14} style={{ color: isActive ? cat.color : undefined }} className={isActive ? '' : 'text-faint'} />}
            <span>{pick(cat, 'label')}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
