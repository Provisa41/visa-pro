/** Локальные изображения: официальный консульский стиль */
export const images = {
  consularOfficial: '/images/consular-official.png',
  passportVisa: '/images/passport-visa.png',
  hero: '/images/consular-official.png',
  passport: '/images/passport-visa.png',
  documents: '/images/passport-visa.png',
  news: '/images/consular-official.png',
  consult: '/images/consular-official.png',
  profile: '/images/passport-visa.png',
  onboarding1: '/images/consular-official.png',
  onboarding2: '/images/passport-visa.png',
  onboarding3: '/images/consular-official.png',
} as const;

/** Популярные направления для быстрого выбора */
export const POPULAR_COUNTRY_CODES = [
  'de', 'fr', 'it', 'es', 'gr', 'us', 'gb', 'cn', 'jp', 'ae',
  'tr', 'th', 'pt', 'nl', 'at', 'cz', 'fi', 'in', 'kr', 'ca',
  'pl', 'hu', 'ch', 'eg', 'me', 'kz', 'ge', 'rs', 'au', 'sg',
] as const;

export const consularColors = {
  navy: '#0a1628',
  navyMid: '#1a2d4a',
  navyLight: '#243b5c',
  gold: '#c9a227',
  goldLight: '#e8d48b',
  cream: '#f7f5f0',
  creamDark: '#ebe8e1',
  border: 'rgba(201, 162, 39, 0.35)',
  textOnDark: '#f7f5f0',
  textMuted: '#8a9bb5',
} as const;

export const gradients = {
  hero: `linear-gradient(135deg, ${consularColors.navy} 0%, ${consularColors.navyMid} 50%, ${consularColors.navyLight} 100%)`,
  heroOverlay:
    'linear-gradient(to top, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.55) 60%, rgba(10,22,40,0.35) 100%)',
  cardOverlay:
    'linear-gradient(180deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.92) 100%)',
  goldLine: `linear-gradient(90deg, transparent, ${consularColors.gold}, transparent)`,
  softBg: `linear-gradient(180deg, ${consularColors.creamDark} 0%, ${consularColors.cream} 120px)`,
} as const;

export const actionCards = [
  {
    title: 'Чек-лист документов',
    desc: 'Перечень и статус по требованиям консульства',
    path: '/checklist',
    image: images.passportVisa,
    icon: '📋',
  },
  {
    title: 'Проверка документов',
    desc: 'Экспертный анализ пакета (AI)',
    path: '/doc-check',
    image: images.passportVisa,
    icon: '🔍',
  },
  {
    title: 'Официальные новости',
    desc: 'Изменения визовых правил',
    path: '/news',
    image: images.consularOfficial,
    icon: '📰',
  },
  {
    title: 'Консультация',
    desc: 'Связь с визовым специалистом',
    path: '/consult',
    image: images.consularOfficial,
    icon: '🏛️',
  },
] as const;
