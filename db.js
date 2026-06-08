import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🚀 MongoDB подключена: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Ошибка подключения: ${error.message}`);
        // Выходим из процесса с ошибкой
        process.exit(1);
    }
};

export default connectDB;