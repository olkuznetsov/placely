import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

/**
 * 3D tilt wrapper — tracks the pointer and rotates the card in perspective,
 * with a moving light glare. Owns the card chrome (rounded corners + clip).
 */
export default function TiltCard({ children, className = '', max = 7, onClick }) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 260, damping: 24 })
  const sy = useSpring(py, { stiffness: 260, damping: 24 })

  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])
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
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full rounded-3xl overflow-hidden hairline shadow-depth cursor-pointer"
      >
        {children}
        {/* moving light glare */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  )
}
