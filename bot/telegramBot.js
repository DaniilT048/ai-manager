import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

// Проверяем, есть ли токен в .env, чтобы проект не падал молча
if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не задан в файле .env');
    process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Реагируем на команду /start
bot.start((ctx) => {
    ctx.reply('Альхамдулиллах. Иншала брат, смерть неверным');
});

// Ловим любое текстовое сообщение (пока работает как эхо)
bot.on('text', async (ctx) => {
    const userMessage = ctx.message.text;
    const chatId = ctx.chat.id; // Тот самый уникальный ID, который мы потом сохраним в Mongo

    ctx.reply(`Ты написал: "${userMessage}" Но ты черт. Мой chatId в этой сессии: ${chatId}`);
});

// Функция для запуска бота, которую мы вызовем в server.js
export const launchBot = () => {
    bot.launch()
        .then(() => console.log('🤖 Telegram-бот успешно запущен и слушает сообщения!'))
        .catch((err) => console.error('❌ Ошибка при запуске бота:', err));
};

// Корректная остановка бота при перезапуске сервера (чтобы соединение не зависало)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));