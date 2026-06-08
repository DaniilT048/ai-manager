import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import Message from '../models/Message.js';
import { generateAIResponse } from '../services/aiService.js';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Привет! Я твой ИИ-менеджер с отличной памятью. Задавай свои вопросы! 😎');
});

bot.on('text', async (ctx) => {
    const userMessage = ctx.message.text;
    const chatId = ctx.chat.id;
    const userName = ctx.from.first_name || 'Guest';

    try {
        // 1. Сохраняем новое сообщение от юзера в базу
        await Message.create({ chatId, userName, text: userMessage, role: 'user' });

        await ctx.sendChatAction('typing');

        // 2. Достаем из MongoDB последние 15 сообщений чата, чтобы ИИ помнил контекст
        const rawHistory = await Message.find({ chatId })
            .sort({ createdAt: -1 }) // Берем самые свежие
            .limit(15);

        // Переворачиваем массив обратно, чтобы хронология шла от старых к новым
        const formattedHistory = rawHistory.reverse().map(msg => ({
            role: msg.role,       // 'user' или 'assistant'
            content: msg.text     // Текст сообщения
        }));

        // 3. Передаем всю историю в OpenAI
        const aiReply = await generateAIResponse(formattedHistory);

        // 4. Сохраняем ответ ИИ в базу
        await Message.create({ chatId, userName: 'AI_Manager', text: aiReply, role: 'assistant' });

        // 5. Отправляем ответ пользователю в Telegram
        await ctx.reply(aiReply);

    } catch (error) {
        console.error('❌ Ошибка в обработчике текста:', error);
        ctx.reply('Произошла какая-то ошибка на сервере...');
    }
});

export const launchBot = () => {
    bot.launch()
        .then(() => console.log('🤖 Telegram-бот успешно запущен и помнит всё!'))
        .catch((err) => console.error('❌ Ошибка при запуске бота:', err));
};

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));