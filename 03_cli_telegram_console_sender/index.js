import TelegramBot from 'node-telegram-bot-api';

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TOKEN';

const options = {
	polling: true,
	filepath: false,
};
export const bot = new TelegramBot(TOKEN, options);
