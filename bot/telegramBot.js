import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import Message from '../models/Message.js';
import { generateAIResponse } from '../services/aiService.js'; // <-- Импортируем ИИ-сервис

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Привет! Теперь я подключен к базе данных и готов общаться через ИИ. Задавай свои вопросы! 😎');
});

bot.on('text', async (ctx) => {
    const userMessage = ctx.message.text;
    const chatId = ctx.chat.id;
    const userName = ctx.from.first_name || 'Guest';

    try {
        // 1. Сохраняем входящее сообщение от юзера в MongoDB
        await Message.create({
            chatId: chatId,
            userName: userName,
            text: userMessage,
            role: 'user'
        });
        console.log(`💾 Сообщение от ${userName} сохранено.`);

        // Показываем в телеге статус "печатает...", пока ИИ думает (юзер-экспириенс!)
        await ctx.sendChatAction('typing');

        // 2. Генерируем ответ с помощью OpenAI
        const aiReply = await generateAIResponse(userMessage);

        // 3. Сохраняем ответ самого ИИ в MongoDB
        await Message.create({
            chatId: chatId,
            userName: 'AI_Manager',
            text: aiReply,
            role: 'assistant' // Важно: тут роль assistant
        });
        console.log(`💾 Ответ ИИ сохранен в базу.`);

        // 4. Отправляем ответ пользователю в Telegram
        await ctx.reply(aiReply);

    } catch (error) {
        console.error('❌ Ошибка в обработчике текста:', error);
        ctx.reply('Произошла какая-то ошибка на сервере...');
    }
});

export const launchBot = () => {
    bot.launch()
        .then(() => console.log('🤖 Telegram-бот успешно запущен и слушает сообщения!'))
        .catch((err) => console.error('❌ Ошибка при запуске бота:', err));
};

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));