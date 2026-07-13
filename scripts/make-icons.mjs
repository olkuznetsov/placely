/**
 * Generates the Wishplace brand assets from inline SVG:
 *   favicon, apple-touch-icon, PWA icons (+ maskable), og image, icon.svg
 * Run: node scripts/make-icons.mjs
 */
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

// the mark: gold wish-pin over dusk ridges under first stars
// `maskable` shrinks the glyph into the 80% safe zone for adaptive masks
const iconSvg = (maskable = false) => `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111634"/>
      <stop offset="60%" stop-color="#0B0E20"/>
      <stop offset="100%" stop-color="#090B14"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7D398"/>
      <stop offset="55%" stop-color="#EFB35C"/>
      <stop offset="100%" stop-color="#C9822F"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.62" r="0.5">
      <stop offset="0%" stop-color="#EFB35C" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#EFB35C" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#EFB35C" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="80" cy="80" r="4" fill="#F1EDE2" opacity="0.8"/>
  <circle cx="430" cy="60" r="3" fill="#F1EDE2" opacity="0.55"/>
  <circle cx="360" cy="120" r="2.5" fill="#F1EDE2" opacity="0.4"/>
  <circle cx="150" cy="50" r="2.5" fill="#F1EDE2" opacity="0.5"/>
  <circle cx="60" cy="200" r="3" fill="#F1EDE2" opacity="0.35"/>
  <circle cx="460" cy="180" r="2.5" fill="#F1EDE2" opacity="0.45"/>
  <ellipse cx="256" cy="330" rx="240" ry="180" fill="url(#glow)"/>
  <path d="M0 512 L0 400 L100 300 L190 380 L290 280 L390 370 L460 320 L512 360 L512 512 Z" fill="#161B33"/>
  <path d="M0 512 L0 460 L120 380 L230 450 L340 370 L440 440 L512 400 L512 512 Z" fill="#0A0D1A"/>
  <g${maskable ? ' transform="translate(256 256) scale(0.78) translate(-256 -256)"' : ''}>
    <path d="M256 96 C 193 96 144 145 144 208 C 144 292 256 396 256 396 C 256 396 368 292 368 208 C 368 145 319 96 256 96 Z" fill="url(#gold)"/>
    <circle cx="256" cy="206" r="46" fill="#0B0E20"/>
    <path d="M368 84 L380 114 L410 126 L380 138 L368 168 L356 138 L326 126 L356 114 Z" fill="#F7D398"/>
  </g>
</svg>`

// link-preview card: pure scene (no text — og:title carries the name)
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0E22"/>
      <stop offset="70%" stop-color="#0C1024"/>
      <stop offset="100%" stop-color="#090B14"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7D398"/>
      <stop offset="55%" stop-color="#EFB35C"/>
      <stop offset="100%" stop-color="#C9822F"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.75" r="0.55">
      <stop offset="0%" stop-color="#EFB35C" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#EFB35C" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#EFB35C" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="120" cy="90" r="4" fill="#F1EDE2" opacity="0.7"/>
  <circle cx="300" cy="60" r="3" fill="#F1EDE2" opacity="0.45"/>
  <circle cx="520" cy="110" r="2.5" fill="#F1EDE2" opacity="0.5"/>
  <circle cx="760" cy="70" r="3.5" fill="#F1EDE2" opacity="0.6"/>
  <circle cx="950" cy="130" r="2.5" fill="#F1EDE2" opacity="0.4"/>
  <circle cx="1100" cy="80" r="3" fill="#F1EDE2" opacity="0.55"/>
  <circle cx="80" cy="250" r="2.5" fill="#F1EDE2" opacity="0.35"/>
  <circle cx="1140" cy="260" r="2.5" fill="#F1EDE2" opacity="0.35"/>
  <ellipse cx="600" cy="470" rx="520" ry="270" fill="url(#glow)"/>
  <path d="M0 630 L0 470 L200 330 L370 440 L560 300 L760 430 L950 340 L1200 450 L1200 630 Z" fill="#161B33"/>
  <path d="M0 630 L0 540 L260 430 L480 520 L720 420 L950 510 L1200 460 L1200 630 Z" fill="#0A0D1A"/>
  <g transform="translate(344 50)">
    <path d="M256 96 C 193 96 144 145 144 208 C 144 292 256 396 256 396 C 256 396 368 292 368 208 C 368 145 319 96 256 96 Z" fill="url(#gold)"/>
    <circle cx="256" cy="206" r="46" fill="#0B0E20"/>
    <path d="M368 84 L380 114 L410 126 L380 138 L368 168 L356 138 L326 126 L356 114 Z" fill="#F7D398"/>
  </g>
</svg>`

const render = (svg, size, out) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toFile(out)

await render(iconSvg(), 512, 'public/pwa-512x512.png')
await render(iconSvg(), 192, 'public/pwa-192x192.png')
await render(iconSvg(), 180, 'public/apple-touch-icon.png')
await render(iconSvg(), 64, 'public/favicon.png')
await render(iconSvg(true), 512, 'public/pwa-maskable-512.png')
await sharp(Buffer.from(ogSvg)).png().toFile('public/og.png')
writeFileSync('public/icon.svg', iconSvg())

console.log('brand assets generated')
