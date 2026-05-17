# Visa Pro

Telegram Mini App для оформления виз: чек-листы, AI-проверка документов, новости, консультации с менеджером.

## Структура проекта

```
ProViza2/
├── frontend/          # React + TypeScript + MUI + RTK Query
│   └── src/
│       ├── pages/     # Onboarding, Home, Checklist, DocCheck, News, Consult, Profile
│       ├── components/
│       ├── store/
│       └── theme/
├── backend/           # Express + Prisma + PostgreSQL
│   ├── prisma/
│   └── src/
│       ├── routes/
│       ├── services/  # JWT, Telegram auth, OpenAI
│       └── data/      # JSON-справочники (MVP)
└── bot/               # Telegraf — кнопка WebApp и уведомления
```

## Быстрый старт

### 1. Зависимости

```bash
npm install
```

### 2. База данных

Создайте PostgreSQL (например [Render](https://render.com)) и скопируйте:

```bash
cp backend/.env.example backend/.env
```

Укажите `DATABASE_URL`, `JWT_SECRET`, `TELEGRAM_BOT_TOKEN`, при необходимости `OPENAI_API_KEY`.

```bash
npm run db:generate
npm run db:push
```

### 3. Запуск

```bash
# Терминал 1 — API
npm run dev:backend

# Терминал 2 — фронт
cp frontend/.env.example frontend/.env
npm run dev:frontend

# Терминал 3 — бот (опционально)
cp bot/.env.example bot/.env
npm run dev:bot
```

Фронт: http://localhost:5173  
API: http://localhost:3001/health

### 4. Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather).
2. `/newapp` или Menu Button → URL вашего HTTPS-фронта (Vercel/Netlify).
3. Укажите `TELEGRAM_BOT_TOKEN` в `backend/.env` и `bot/.env`.
4. `WEBAPP_URL` в боте — публичный URL mini app.

## MVP-функции

| Экран | Маршрут | Описание |
|-------|---------|----------|
| Onboarding | `/onboarding` | Приветствие, слайдер |
| Главная | `/` | 4 карточки, страна, статус заявки |
| Чек-лист | `/checklist` | Шаблоны + статусы готов/нужно/нет |
| AI-проверка | `/doc-check` | Загрузка PDF/JPG, отчёт |
| Новости | `/news` | Лента + подписки |
| Консультация | `/consult` | FAQ, форма, менеджеры |
| Профиль | `/profile` | История, подписки |

## API (основное)

- `POST /api/auth/telegram` — JWT по `initData`
- `GET /api/checklist/:country/:visaType`
- `PUT /api/checklist/:country/:visaType`
- `POST /api/documents/analyze` (multipart)
- `GET /api/news`, `POST /api/news/subscribe`
- `POST /api/consult`
- `GET /api/user/me`

## Деплой

- **Frontend:** Vercel/Netlify, HTTPS обязателен.
- **Backend:** Railway/Render/VPS, `FRONTEND_URL` для CORS.
- **DB:** PostgreSQL (Render free tier).
- **Bot:** `WEBAPP_URL` = production URL фронта.

## Без OpenAI

Без `OPENAI_API_KEY` AI-проверка возвращает демо-отчёт; чек-листы берутся из `backend/src/data/checklist-templates.json`.

## Лицензия

Private / MVP.
