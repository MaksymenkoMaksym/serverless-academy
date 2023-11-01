import TelegramBot from 'node-telegram-bot-api';
import {
	getExchangeRateMono,
	getExchangeRatePrivate,
	getWeatherForecast,
} from './helper.js';

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TOKEN';

const bot = new TelegramBot(TOKEN, { polling: true });
const CITY = 'Delmenhorst';

const initialMenu = {
	reply_markup: {
		keyboard: [[`Forecast in ${CITY}`, `Exchange rate`]],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

const submenuWeather = {
	reply_markup: {
		keyboard: [['Every 3 Hours', 'Every 6 Hours', 'Previous menu']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

const submenuExchangeRate = {
	reply_markup: {
		keyboard: [['USD', 'EUR', 'Previous menu']],
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
			bot.sendMessage(chatId, 'Select forecast interval:', submenuWeather);
			break;

		case 'Every 3 Hours':
			const message3Hr = await getWeatherForecast(chatId, 3);
			bot.sendMessage(chatId, message3Hr);
			break;
		case 'Every 6 Hours':
			const message6Hr = await getWeatherForecast(chatId, 6);
			bot.sendMessage(chatId, message6Hr);
			break;
		case 'Previous menu':
			bot.sendMessage(chatId, 'Welcome to Weather bot!', initialMenu);
			break;
	}
	switch (text) {
		case `Exchange rate`:
			bot.sendMessage(
				chatId,
				'Select USD or EUR exchange rates:',
				submenuExchangeRate
			);
			break;
		case 'USD':
			const { USD, title } = await getExchangeRatePrivate(text);
			const { USD_MONO, title_MONO } = await getExchangeRateMono(text);
			const replyUSD = title + USD + title_MONO + USD_MONO;

			bot.sendMessage(chatId, replyUSD);
			break;
		case 'EUR':
			const { EUR, title: title_EUR } = await getExchangeRatePrivate(text);
			const { EUR_MONO, title_MONO: title_MONO_EUR } =
				await getExchangeRateMono(text);
			const replyEUR = title_EUR + EUR + title_MONO_EUR + EUR_MONO;

			bot.sendMessage(chatId, replyEUR);
			break;
	}
});
