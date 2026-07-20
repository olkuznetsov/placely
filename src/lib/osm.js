/**
 * OpenStreetMap Nominatim search for add-a-place.
 * Usage policy: ≤1 req/s — callers must debounce.
 */

// OSM class/type → Wishplace category
function toCategory(cls, type) {
  const t = `${cls}:${type}`
  if (/amenity:(cafe|coffee)/.test(t)) return 'cafe'
  if (/amenity:(restaurant|fast_food|food_court)/.test(t)) return 'restaurant'
  if (/amenity:(bar|pub|biergarten|nightclub)/.test(t)) return 'bar'
  if (/(leisure|landuse):(park|garden|nature_reserve)|boundary:national_park/.test(t)) return 'park'
  if (/(tourism|amenity):(museum|gallery|arts_centre)/.test(t)) return 'museum'
  if (/shop:(bakery|pastry|confectionery)/.test(t)) return 'bakery'
  if (/tourism:(viewpoint|attraction)|natural:(peak|cliff)/.test(t)) return 'viewpoint'
  return 'restaurant'
}

export async function searchPlaces(query, lang = 'en', signal) {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '8')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', lang === 'uk' ? 'uk,en' : 'en,uk')

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`nominatim ${res.status}`)
  const rows = await res.json()

  return rows.map(r => {
    const a = r.address ?? {}
    const street = [a.road, a.house_number].filter(Boolean).join(', ')
    const area = a.suburb || a.neighbourhood || a.city_district || a.city || a.town || a.village || ''
    return {
      osmId: `${r.osm_type}-${r.osm_id}`,
      name: r.name || r.display_name.split(',')[0],
      category: toCategory(r.class, r.type),
      address: [street, area].filter(Boolean).join(', ') || r.display_name.split(',').slice(1, 3).join(',').trim(),
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    }
  })
}

/** Build a Wishplace place object from a picked search result. */
export function toPlace(result) {
  return {
    id: `u_${result.osmId}`,
    name: result.name,
    category: result.category,
    cuisine: null,
    priceRange: null,
    rating: null,
    reviewCount: 0,
    image: null,
    description: null,
    address: result.address,
    hours: null,
    lat: result.lat,
    lng: result.lng,
    tags: [],
    savedBy: [],
    addedBy: { id: 1, name: 'You', avatar: null },
    photos: [],
    isMine: true,
  }
}
