import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'
import { categoryMeta } from '../data/mockData'
import { categoryIcons } from '../lib/icons'
import { useLang } from '../lib/i18n'
import { useToast } from './Toast'
import FadeImg from '../lib/FadeImg'
import { buzz } from '../lib/haptics'

const FLING_OFFSET = 110   // px of drag that commits a swipe
const FLING_VELOCITY = 650 // px/s flick that commits a swipe
const TAP_SLOP = 8         // max movement for a press to count as a tap

// tiny rAF tween — deliberately framework-free so the fling can never
// stall on a paused animation loop; starting a new tween on the same
// motion value supersedes the previous one
const activeTweens = new WeakMap()

function tween(mv, to, { duration = 280, ease = (t) => 1 - Math.pow(1 - t, 3), onDone } = {}) {
  const token = Symbol('tween')
  activeTweens.set(mv, token)
  const from = mv.get()
  const t0 = performance.now()
  function step(now) {
    if (activeTweens.get(mv) !== token) return
    const p = Math.min((now - t0) / duration, 1)
    mv.set(from + (to - from) * ease(p))
    if (p < 1) requestAnimationFrame(step)
    else onDone?.()
  }
  requestAnimationFrame(step)
}

/**
 * Swipeable 3D deck of wishlist places. Swipe right → "going soon";
 * swipe left → later (back of the deck); tap → open the place.
 * Drag is hand-rolled on pointer events so it behaves identically for
 * mouse, touch and pen.
 */
export default function WishDeck({ places, onOpen, markSoon, isSoon }) {
  const { t, pick, price } = useLang()
  const showToast = useToast()
  const [ids, setIds] = useState(() => places.map(p => p.id))
  const [busy, setBusy] = useState(false)
  const dragRef = useRef(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-240, 240], [-13, 13])
  const rotateY = useTransform(x, [-240, 240], [9, -9])
  const topOpacity = useTransform(x, [-520, -260, 0, 260, 520], [0, 1, 1, 1, 0])
  const soonOpacity = useTransform(x, [40, 130], [0, 1])
  const laterOpacity = useTransform(x, [-130, -40], [1, 0])

  // reconcile with live saves/visits: keep known order, append newly saved
  const byId = new Map(places.map(p => [p.id, p]))
  const queue = [...ids.filter(id => byId.has(id)), ...places.filter(p => !ids.includes(p.id)).map(p => p.id)]
  const visible = queue.slice(0, 3).map(id => byId.get(id))

  function fling(dir, place) {
    setBusy(true)
    buzz()
    if (dir > 0) {
      markSoon?.(place.id)
      showToast({ message: t('toast.soon') })
    }
    tween(x, dir * 560, {
      duration: 260,
      ease: (t2) => t2 * t2,
      onDone: () => {
        const next = [...queue]
        next.push(next.shift())
        setIds(next)
        setBusy(false)
        x.set(0)
      },
    })
  }

  function settleBack() {
    tween(x, 0, { duration: 300 })
  }

  function handleDown(e, place) {
    if (busy || dragRef.current) return
    const s = { start: e.clientX, last: e.clientX, t: performance.now(), v: 0, moved: 0 }
    dragRef.current = s

    // capture phase: nothing in the tree can stopPropagation these away
    const cleanup = () => {
      window.removeEventListener('pointermove', onMove, true)
      window.removeEventListener('pointerup', onUp, true)
      window.removeEventListener('pointercancel', onCancel, true)
      dragRef.current = null
    }
    const onMove = (ev) => {
      const now = performance.now()
      const dt = now - s.t
      if (dt > 0) s.v = 0.8 * s.v + 0.2 * (((ev.clientX - s.last) / dt) * 1000)
      s.last = ev.clientX
      s.t = now
      const dx = ev.clientX - s.start
      s.moved = Math.max(s.moved, Math.abs(dx))
      x.set(dx)
    }
    const onUp = (ev) => {
      cleanup()
      const dx = ev.clientX - s.start
      if (Math.abs(dx) > FLING_OFFSET || Math.abs(s.v) > FLING_VELOCITY) {
        fling((dx || s.v) > 0 ? 1 : -1, place)
      } else if (s.moved < TAP_SLOP) {
        settleBack()
        onOpen?.(place)
      } else {
        settleBack()
      }
    }
    const onCancel = () => {
      cleanup()
      settleBack()
    }
    window.addEventListener('pointermove', onMove, true)
    window.addEventListener('pointerup', onUp, true)
    window.addEventListener('pointercancel', onCancel, true)

    try { e.currentTarget.setPointerCapture?.(e.pointerId) } catch { /* fine without capture */ }
  }

  if (queue.length === 0) return null

  return (
    <div className="px-5 select-none">
      <div className="relative h-[340px]" style={{ perspective: 1000 }}>
        {visible.map((place, i) => {
          const isTop = i === 0
          const meta = categoryMeta[place.category]
          const CatIcon = meta ? categoryIcons[meta.icon] : MapPin
          const name = pick(place, 'name')

          return (
            <motion.div
              key={place.id}
              className="absolute inset-x-0 top-8 bottom-0"
              style={
                isTop
                  ? { x, rotate, rotateY, opacity: topOpacity, zIndex: 3, touchAction: 'pan-y', cursor: 'grab' }
                  : { zIndex: 3 - i }
              }
              animate={
                isTop
                  ? { y: 0, scale: 1 }
                  : { y: i * -16, scale: 1 - i * 0.055, opacity: 1 - i * 0.3 }
              }
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              data-deck-top={isTop || undefined}
              role={isTop ? 'button' : undefined}
              aria-label={isTop ? name : undefined}
              onPointerDown={isTop ? (e) => handleDown(e, place) : undefined}
            >
              <div className="relative h-full rounded-3xl overflow-hidden hairline shadow-pop bg-ink-2">
                <FadeImg
                  src={place.image}
                  alt={name}
                  draggable={false}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-chip">
                  {CatIcon && <CatIcon size={12} style={{ color: meta?.color }} />}
                  <span className="text-[11px] font-semibold tracking-wide text-cream/90">
                    {meta ? pick(meta, 'label') : place.category}
                  </span>
                </div>

                {isSoon?.(place.id) && (
                  <span className="absolute top-4 right-4 px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-gold/15 text-gold-soft border border-gold/40">
                    {t('deck.soonBadge')}
                  </span>
                )}

                {/* swipe-direction overlays — only meaningful on the top card */}
                {isTop && (
                  <>
                    <motion.div
                      aria-hidden
                      style={{ opacity: soonOpacity }}
                      className="absolute top-8 left-6 rotate-[-10deg] px-3.5 py-1.5 rounded-xl border-2 border-gold text-gold font-bold text-lg tracking-widest bg-ink/40"
                    >
                      {t('deck.soon')}
                    </motion.div>
                    <motion.div
                      aria-hidden
                      style={{ opacity: laterOpacity }}
                      className="absolute top-8 right-6 rotate-[10deg] px-3.5 py-1.5 rounded-xl border-2 border-faint text-muted font-bold text-lg tracking-widest bg-ink/40"
                    >
                      {t('deck.later')}
                    </motion.div>
                  </>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl text-cream leading-tight line-clamp-1">
                    {name}
                  </h3>
                  <p className="text-muted text-sm mt-0.5 line-clamp-1">
                    {[pick(place, 'cuisine'), price(place.priceRange)].filter(Boolean).join(' · ')}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full glass-chip">
                      <Star size={11} className="fill-gold text-gold" />
                      <span className="text-xs font-semibold text-gold-soft">{place.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-faint text-[11px] min-w-0 ml-3">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{pick(place, 'address')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <p className="text-center text-faint text-[11px] mt-3 tracking-wide">
        {t('home.deckHint')}
      </p>
    </div>
  )
}
