import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL ?? 'https://your-frontend.vercel.app';

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN не задан');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(
    'Добро пожаловать в Visa Pro! Откройте мини-приложение для чек-листов, AI-проверки документов и консультаций.',
    Markup.keyboard([
      Markup.button.webApp('Открыть Visa Pro', webAppUrl),
    ]).resize()
  );
});

bot.command('app', (ctx) => {
  ctx.reply(
    'Visa Pro Mini App',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть', webAppUrl),
    ])
  );
});

/** Уведомление пользователю (вызывать из cron/worker) */
export async function notifyUser(
  telegramId: number,
  text: string
): Promise<void> {
  await bot.telegram.sendMessage(telegramId, text, { parse_mode: 'HTML' });
}

bot.launch().then(() => {
  console.log('Visa Pro bot запущен');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
