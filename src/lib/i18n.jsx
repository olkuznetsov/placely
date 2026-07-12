import { createContext, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Minimal i18n for Wishplace — EN + UK.
 *
 * Ukraine's language law requires consumer-facing apps to offer a Ukrainian
 * UI, loaded by default for Ukrainian users — so `uk` is auto-detected from
 * the browser locale and persisted.
 */

const LANG_KEY = 'wishplace.lang.v1'

const dict = {
  en: {
    // nav
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.saved': 'Saved',
    'nav.friends': 'Friends',
    'nav.profile': 'Profile',
    // home
    'home.eyebrow': 'Your places wishlist',
    'home.greeting': 'Where to next,',
    'home.friendsExploring': 'are exploring with you',
    'home.friendsCount': '{n} friends',
    'home.search': 'Search places, cravings, or tags...',
    'home.journey': 'Your journey',
    'home.pinned': '{n} pinned',
    'home.lived': '{n} lived',
    'home.upNext': 'Up',
    'home.upNextAccent': 'next',
    'home.onWishlist': '{n} on your wishlist',
    'home.deckHint': 'Drag to shuffle · tap to open',
    'home.friendsSaving': 'Friends are saving',
    'home.seeAll': 'SEE ALL',
    'home.trending': 'Trending with',
    'home.trendingAccent': 'friends',
    'home.results': 'Results',
    'home.places': '{n} places',
    'home.emptyTitle': 'Uncharted territory',
    'home.emptySub': 'Try a different search or category',
    'feed.saved': 'pinned',
    'feed.visited': 'visited',
    'feed.reviewed': 'reviewed',
    'feed.created': 'created',
    // deck
    'deck.soon': 'SOON ✦',
    'deck.later': 'LATER',
    'deck.soonBadge': 'Soon ✦',
    // explore
    'explore.title': 'Explore',
    'explore.search': 'Search places nearby...',
    'explore.onMap': '{n} places on the map',
    'explore.tapPin': 'Tap a pin for details',
    'explore.nearMe': 'Near me',
    'explore.found': '{n} places found',
    // collections
    'col.title': 'Collections',
    'col.subtitle': 'Spots you love, curated with friends',
    'col.new': 'New',
    'col.allSaved': 'All saved places',
    'col.pinsInAtlas': '{n} pins in your atlas',
    'col.places': '{n} places',
    'col.shared': 'Shared',
    'col.private': 'Private',
    'col.newCollection': 'New collection',
    'col.groupSpots': 'Group spots you love with friends',
    'col.back': 'Collections',
    // friends
    'fr.title': 'Friends',
    'fr.add': 'Add Friend',
    'fr.feed': 'Activity Feed',
    'fr.myFriends': 'My Friends',
    'fr.search': 'Search friends...',
    'fr.suggested': 'Suggested for you',
    'fr.yourFriends': 'Your friends ({n})',
    'fr.saved': '{n} saved',
    'fr.mutual': '{n} mutual',
    'fr.view': 'View',
    'fr.follow': 'Follow',
    'fr.like': 'Like',
    'fr.liked': 'Liked',
    'fr.comment': 'Comment',
    'fr.share': 'Share',
    'fr.addSheet': 'Add friends',
    'fr.searchUsers': 'Search by name or username...',
    'fr.suggestions': 'Suggested',
    'fr.searchResults': 'Search results',
    'fr.sent': 'Sent',
    'fr.addBtn': 'Add',
    'fr.noUsers': 'No travelers found for "{q}"',
    'fr.savedPlace': 'pinned a place',
    'fr.visitedPlace': 'visited',
    'fr.reviewedPlace': 'reviewed',
    'fr.createdCol': 'created a collection',
    // profile
    'pr.passport': 'Traveler’s passport',
    'pr.streak': '{n}-day streak',
    'pr.dreams': '{x} of {y} dreams lived',
    'pr.pinned': 'Pinned',
    'pr.lived': 'Lived',
    'pr.lists': 'Lists',
    'pr.friends': 'Friends',
    'pr.stamps': 'Passport stamps',
    'pr.all': 'ALL',
    'pr.drawnTo': 'Drawn to',
    'pr.settings': 'Settings & Preferences',
    'pr.since': 'Charting places since {date}',
    // settings
    'set.title': 'Settings',
    'set.notifications': 'Notifications',
    'set.notificationsSub': 'Friend activity, saves, reminders',
    'set.appearance': 'Appearance',
    'set.appearanceSub': 'Dusk (dark) — light theme on the roadmap',
    'set.language': 'Language',
    'set.languageSub': 'Interface language',
    'set.privacy': 'Privacy & Data',
    'set.appPrefs': 'App Preferences',
    'set.help': 'Help & Support',
    'set.signOut': 'Sign Out',
    // place detail
    'pd.story': 'The story',
    'pd.location': 'Location',
    'pd.hours': 'Hours',
    'pd.directions': 'Directions',
    'pd.collect': 'Collect',
    'pd.friendsKeep': 'keep this place in their atlas',
    'pd.friendsN': '{n} friends',
    // collection modal
    'cm.title': 'Save to collection',
    'cm.newCollection': 'New collection',
    'cm.name': 'Collection name...',
    'cm.create': 'Create',
    'cm.places': '{n} places',
    // toasts
    'toast.pinned': 'Pinned "{name}" ✦',
    'toast.unpinned': 'Removed from your atlas',
    'toast.lived': 'Marked as lived ✦',
    'toast.unlived': 'Back on the wishlist',
    'toast.linkCopied': 'Link copied to clipboard',
    'toast.addedTo': 'Added to "{name}"',
    'toast.colCreated': 'Collection "{name}" created ✦',
    'toast.requestSent': 'Friend request sent to {name} ✦',
    'toast.comingSoon': '{what} — coming soon',
    'toast.soon': 'On the soon list ✦',
    'toast.likeAdded': 'Liked ✦',
    'toast.likeRemoved': 'Like removed',
    'toast.signedOut': 'Signed out successfully',
    'toast.lightTheme': 'Light theme — coming soon',
    'toast.profileSoon': "{name}'s atlas — coming soon",
    'toast.editSoon': 'Edit profile',
    'toast.commentsSoon': 'Comments',
    'toast.allStamps': 'All stamps',
    'toast.allBadges': 'All badges',
    'free': 'Free',
  },

  uk: {
    // nav
    'nav.home': 'Головна',
    'nav.explore': 'Дослідити',
    'nav.saved': 'Збережене',
    'nav.friends': 'Друзі',
    'nav.profile': 'Профіль',
    // home
    'home.eyebrow': 'Твій список бажаних місць',
    'home.greeting': 'Куди далі,',
    'home.friendsExploring': 'досліджують разом з тобою',
    'home.friendsCount': 'Друзів: {n}',
    'home.search': 'Шукай місця, смаки чи теги...',
    'home.journey': 'Твоя подорож',
    'home.pinned': '{n} збережено',
    'home.lived': '{n} відвідано',
    'home.upNext': 'Наступна',
    'home.upNextAccent': 'зупинка',
    'home.onWishlist': 'У списку бажань: {n}',
    'home.deckHint': 'Тягни, щоб перегорнути · торкнись, щоб відкрити',
    'home.friendsSaving': 'Друзі зберігають',
    'home.seeAll': 'УСІ',
    'home.trending': 'Популярне серед',
    'home.trendingAccent': 'друзів',
    'home.results': 'Результати',
    'home.places': 'Місць: {n}',
    'home.emptyTitle': 'Недосліджена територія',
    'home.emptySub': 'Спробуй інший запит або категорію',
    'feed.saved': 'зберігає',
    'feed.visited': 'відвідує',
    'feed.reviewed': 'оцінює',
    'feed.created': 'створює',
    // deck
    'deck.soon': 'СКОРО ✦',
    'deck.later': 'ПОТІМ',
    'deck.soonBadge': 'Скоро ✦',
    // explore
    'explore.title': 'Дослідити',
    'explore.search': 'Шукай місця поруч...',
    'explore.onMap': 'Місць на мапі: {n}',
    'explore.tapPin': 'Торкнись позначки для деталей',
    'explore.nearMe': 'Поруч',
    'explore.found': 'Знайдено місць: {n}',
    // collections
    'col.title': 'Колекції',
    'col.subtitle': 'Улюблені місця — разом із друзями',
    'col.new': 'Нова',
    'col.allSaved': 'Усі збережені місця',
    'col.pinsInAtlas': 'Місць у твоєму атласі: {n}',
    'col.places': 'Місць: {n}',
    'col.shared': 'Спільна',
    'col.private': 'Приватна',
    'col.newCollection': 'Нова колекція',
    'col.groupSpots': 'Об’єднуй улюблені місця з друзями',
    'col.back': 'Колекції',
    // friends
    'fr.title': 'Друзі',
    'fr.add': 'Додати друга',
    'fr.feed': 'Стрічка',
    'fr.myFriends': 'Мої друзі',
    'fr.search': 'Шукати друзів...',
    'fr.suggested': 'Можливо, знайомі',
    'fr.yourFriends': 'Твої друзі ({n})',
    'fr.saved': 'Збережено: {n}',
    'fr.mutual': 'Спільних: {n}',
    'fr.view': 'Профіль',
    'fr.follow': 'Стежити',
    'fr.like': 'Вподобати',
    'fr.liked': 'Вподобано',
    'fr.comment': 'Коментар',
    'fr.share': 'Поділитись',
    'fr.addSheet': 'Додати друзів',
    'fr.searchUsers': 'Пошук за іменем або нікнеймом...',
    'fr.suggestions': 'Пропозиції',
    'fr.searchResults': 'Результати пошуку',
    'fr.sent': 'Надіслано',
    'fr.addBtn': 'Додати',
    'fr.noUsers': 'Нікого не знайдено за запитом «{q}»',
    'fr.savedPlace': 'зберігає місце',
    'fr.visitedPlace': 'відвідує',
    'fr.reviewedPlace': 'оцінює',
    'fr.createdCol': 'створює колекцію',
    // profile
    'pr.passport': 'Паспорт мандрівника',
    'pr.streak': 'Днів поспіль: {n}',
    'pr.dreams': 'Здійснено мрій: {x} з {y}',
    'pr.pinned': 'Збережено',
    'pr.lived': 'Відвідано',
    'pr.lists': 'Списки',
    'pr.friends': 'Друзі',
    'pr.stamps': 'Штампи паспорта',
    'pr.all': 'УСІ',
    'pr.drawnTo': 'Тебе вабить',
    'pr.settings': 'Налаштування',
    'pr.since': 'Мандрує з {date}',
    // settings
    'set.title': 'Налаштування',
    'set.notifications': 'Сповіщення',
    'set.notificationsSub': 'Активність друзів, збереження, нагадування',
    'set.appearance': 'Вигляд',
    'set.appearanceSub': 'Сутінки (темна) — світла тема в планах',
    'set.language': 'Мова',
    'set.languageSub': 'Мова інтерфейсу',
    'set.privacy': 'Приватність і дані',
    'set.appPrefs': 'Параметри застосунку',
    'set.help': 'Допомога та підтримка',
    'set.signOut': 'Вийти',
    // place detail
    'pd.story': 'Історія',
    'pd.location': 'Локація',
    'pd.hours': 'Години',
    'pd.directions': 'Маршрут',
    'pd.collect': 'У колекцію',
    'pd.friendsKeep': 'тримають це місце у своєму атласі',
    'pd.friendsN': 'Друзів: {n}',
    // collection modal
    'cm.title': 'Зберегти в колекцію',
    'cm.newCollection': 'Нова колекція',
    'cm.name': 'Назва колекції...',
    'cm.create': 'Створити',
    'cm.places': 'Місць: {n}',
    // toasts
    'toast.pinned': 'Закріплено «{name}» ✦',
    'toast.unpinned': 'Прибрано з атласу',
    'toast.lived': 'Позначено як відвідане ✦',
    'toast.unlived': 'Знову у списку бажань',
    'toast.linkCopied': 'Посилання скопійовано',
    'toast.addedTo': 'Додано до «{name}»',
    'toast.colCreated': 'Колекцію «{name}» створено ✦',
    'toast.requestSent': 'Запит надіслано: {name} ✦',
    'toast.comingSoon': '{what} — скоро',
    'toast.soon': 'У найближчих планах ✦',
    'toast.likeAdded': 'Вподобано ✦',
    'toast.likeRemoved': 'Вподобання прибрано',
    'toast.signedOut': 'Ви вийшли з акаунта',
    'toast.lightTheme': 'Світла тема — скоро',
    'toast.profileSoon': 'Атлас {name} — скоро',
    'toast.editSoon': 'Редагування профілю',
    'toast.commentsSoon': 'Коментарі',
    'toast.allStamps': 'Усі штампи',
    'toast.allBadges': 'Усі значки',
    'free': 'Безкоштовно',
  },
}

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'uk') return saved
  } catch { /* private mode */ }
  const nav = (navigator.language || '').toLowerCase()
  return nav.startsWith('uk') ? 'uk' : 'en'
}

const LangContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem(LANG_KEY, lang) } catch { /* fine */ }
  }, [lang])

  const value = useMemo(() => {
    const t = (key, vars) => {
      let s = dict[lang][key] ?? dict.en[key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v)
      return s
    }
    // localized field access: pick(place, 'description') → description_uk ?? description
    const pick = (obj, field) => (lang === 'uk' ? obj?.[`${field}_uk`] ?? obj?.[field] : obj?.[field])
    // price ranges: "$$" → "₴₴" for uk, "Free" localized
    const price = (range) => {
      if (!range) return range
      if (/^\$+$/.test(range)) return lang === 'uk' ? '₴'.repeat(range.length) : range
      if (range === 'Free') return t('free')
      return range
    }
    return { lang, setLang: setLangState, t, pick, price }
  }, [lang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
