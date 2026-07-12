# Wishplace ✦

**Live: [wishplace.pages.dev](https://wishplace.pages.dev)**

**Your places wishlist — save spots you love, share them with friends, and turn "we should go there sometime" into "we went".**

**Твій список бажаних місць — зберігай улюблені місця, ділись із друзями, і перетворюй «колись сходимо» на «ми там були».**

Wishplace is a small social network built around one idea: everyone keeps a mental list of places they want to try — cafés, viewpoints, speakeasies, bakeries — and those lists are better together. Pin a place, group pins into shared collections, watch what friends are saving, and mark places as *lived* when you finally go.

> 📱 Mobile-first PWA. Open it on your phone, add to home screen, and it feels native.
> 🇺🇦 Fully bilingual (Ukrainian / English). Ukrainian loads by default for `uk` locales — as Ukraine's language law requires for consumer apps. Prices show ₴-style ranges, hours use 24-hour time, and the demo dataset lives in Kyiv.

## Features

- **Wishlist pins** — save any place with one tap; saves persist locally
- **Lived tracking** — mark places you've actually visited; a gold journey ring shows how much of your wishlist you've lived
- **Wish deck** — swipeable 3D card stack of your unvisited saves: swipe right = "going soon", left = later, tap = open
- **Collections** — group spots into decks ("Date Night", "Coffee Crawl") and share them with friends
- **Friend feed** — see what your circle is pinning, visiting, and reviewing
- **Explore map** — dark Kyiv map with glowing category-colored pins (Leaflet + CARTO tiles)
- **Traveler's passport** — profile with stamps (badges), streaks, and journey stats
- **UA/EN localization** — hand-rolled i18n, Cyrillic-capable font fallbacks (Playfair Display / Manrope), ₴ price ranges, 24-hour hours

## Design — "Dusk Atlas"

A dark, cinematic canvas that makes place photography glow, set at golden hour:

- Multi-layer **parallax hero** — stars, drifting aurora, mountain ridges, and a sinking golden-hour glow, each moving at its own scroll rate; the scene also pans with your cursor, and with the **gyroscope** on phones
- **3D tilt cards** — place cards rotate in perspective under your pointer, with depth-layered content (`translateZ`) and a photo that counter-drifts inside the frame
- **Polaroid decks** — collections fan out on hover
- Fraunces display serif + Outfit UI type (Playfair Display + Manrope carry Ukrainian Cyrillic), compass-gold accents, glass surfaces, film grain

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
