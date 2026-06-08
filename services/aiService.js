import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Генерирует ответ ИИ с учетом истории диалога
 * @param {Array} chatHistory - Массив прошлых сообщений в формате [{ role: 'user', content: '...' }]
 * @returns {Promise<string>}
 */
export const generateAIResponse = async (chatHistory) => {
    try {
        const systemPrompt = {
            role: 'system',
            content: 'Ты профессиональный ИИ-менеджер по продажам. Твоя цель — вежливо общаться с клиентами, отвечать на вопросы и помогать сделать заказ. Будь краток и вежлив.'
        };

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            // Склеиваем системную инструкцию и всю историю переписки
            messages: [systemPrompt, ...chatHistory],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('❌ Ошибка OpenAI API:', error);
        return 'Пополни меня';
    }
};