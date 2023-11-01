import TelegramBot from 'node-telegram-bot-api';
import { getWeatherForecast } from './helper.js';

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TOKEN';

const bot = new TelegramBot(TOKEN, { polling: true });
const CITY = 'Delmenhorst';

const initialMenu = {
	reply_markup: {
		keyboard: [[`Forecast in ${CITY}`]],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

const submenu = {
	reply_markup: {
		keyboard: [['Every 3 Hours', 'Every 6 Hours']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

bot.onText(/\/start/, (msg) => {
	let chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Welcome to Weather bot!', initialMenu);
});

bot.on('message', async (msg) => {
	let chatId = msg.chat.id;
	let text = msg.text;

	switch (text) {
		case `Forecast in ${CITY}`:
			bot.sendMessage(chatId, 'Select forecast interval:', submenu);
			break;
		case 'Every 3 Hours':
			const message3Hr = await getWeatherForecast(chatId, 3);
			bot.sendMessage(chatId, message3Hr);
			break;
		case 'Every 6 Hours':
			const message6Hr = await getWeatherForecast(chatId, 6);
			bot.sendMessage(chatId, message6Hr);
			break;
	}
});
