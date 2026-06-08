import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import {launchBot} from "./bot/telegramBot.js"; // Не забывай расширение .js при использовании import

dotenv.config();

// Запускаем подключение к базе
connectDB();

launchBot();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`📡 Сервер запущен на порту ${PORT}`);
});