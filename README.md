# Placely ✦

**Your places wishlist — save spots you love, share them with friends, and turn "we should go there sometime" into "we went".**

Placely is a small social network built around one idea: everyone keeps a mental list of places they want to try — cafés, viewpoints, speakeasies, bakeries — and those lists are better together. Pin a place, group pins into shared collections, watch what friends are saving, and mark places as *lived* when you finally go.

> 📱 Mobile-first PWA. Open it on your phone, add to home screen, and it feels native.

## Features

- **Wishlist pins** — save any place with one tap; saves persist locally
- **Lived tracking** — mark places you've actually visited; a gold journey ring shows how much of your wishlist you've lived
- **Collections** — group spots into decks ("Date Night", "Coffee Crawl") and share them with friends
- **Friend feed** — see what your circle is pinning, visiting, and reviewing
- **Explore map** — dark map with glowing category-colored pins (Leaflet + CARTO tiles)
- **Traveler's passport** — profile with stamps (badges), streaks, and journey stats

## Design — "Dusk Atlas"

A dark, cinematic canvas that makes place photography glow, set at golden hour:

- Multi-layer **parallax hero** — stars, drifting aurora, mountain ridges, and a sinking golden-hour glow, each moving at its own scroll rate
- **3D tilt cards** — place cards rotate in perspective under your pointer with a moving light glare
- **Polaroid decks** — collections fan out on hover
- Fraunces display serif + Outfit UI type, compass-gold accents, glass surfaces, film grain

## Stack

| | |
|---|---|
| UI | React 19, Tailwind CSS v4, framer-motion |
| Map | react-leaflet + CARTO dark tiles |
| Build | Vite 6, vite-plugin-pwa |
| Icons | lucide-react |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5174 (exposed on LAN for phone testing)
npm run build    # production build to dist/
```

## Project structure

```
src/
├── components/   # PlaceCard, TiltCard, PlaceDetail sheet, dock nav, sheets
├── pages/        # Home, Explore, Collections, Friends, Profile
├── hooks/        # useSavedPlaces — saved/visited sets, localStorage-backed
├── data/         # mock places, friends, collections, activity feed
└── lib/          # category icon registry
```

## Status & roadmap

Currently a front-end prototype with mock data. Planned:

- [ ] Real backend (auth, friends, shared collections)
- [ ] Comments & reactions on friend activity
- [ ] Swipeable wishlist triage ("tonight?" card stack)
- [ ] Light theme
- [ ] Place search via geocoding API

---

Personal project by [@olkuznetsov](https://github.com/olkuznetsov). Built with Claude Code.
