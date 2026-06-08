import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Проверяем ключ
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Ошибка: OPENAI_API_KEY не задан в .env');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Отправляет запрос в OpenAI
 * @param {string} userMessage - Сообщение от клиента
 * @returns {Promise<string>} - Ответ от ИИ
 */
export const generateAIResponse = async (userMessage) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Быстрая и дешевая модель, идеальна для тестов и ботов
            messages: [
                {
                    role: 'system',
                    content: 'Ты профессиональный ИИ-менеджер по продажам. Твоя цель — вежливо общаться с клиентами, отвечать на вопросы и помогать сделать заказ.'
                },
                {
                    role: 'user',
                    content: userMessage
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('❌ Ошибка OpenAI API:', error);
        return 'Иди на хуй';
    }
};