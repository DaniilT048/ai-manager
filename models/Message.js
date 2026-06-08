import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chatId: { type: Number, required: true },
    userName: { type: String },
    text: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;