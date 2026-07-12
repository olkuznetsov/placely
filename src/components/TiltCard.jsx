import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

/**
 * 3D tilt wrapper — tracks the pointer and rotates the card in perspective,
 * with a moving light glare.
 *
 * Children can build real depth two ways:
 * - `transform: translateZ(Npx)` (or framer `z`) — pops a layer toward the viewer
 * - `calc(var(--mx) * Npx)` / `var(--my)` — pointer offset in -1..1, for
 *   counter-drifting layers (e.g. the photo behind a clipped frame)
 *
 * Note: the tilt root deliberately has NO overflow clip — clip the photo in a
 * child layer instead, so popped layers aren't flattened by the browser.
 */
export default function TiltCard({ children, className = '', max = 8, onClick }) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 260, damping: 24 })
  const sy = useSpring(py, { stiffness: 260, damping: 24 })

  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const mx = useTransform(sx, v => (v - 0.5) * 2)
  const my = useTransform(sy, v => (v - 0.5) * 2)
  const glareX = useTransform(sx, v => `${v * 100}%`)
  const glareY = useTransform(sy, v => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(255,255,255,0.09), transparent 60%)`

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function reset() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', '--mx': mx, '--my': my }}
        className="relative h-full rounded-3xl cursor-pointer"
      >
        {children}
        {/* moving light glare — floats above every popped layer */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl"
          style={{ background: glare, z: 42 }}
        />
      </motion.div>
    </div>
  )
}
