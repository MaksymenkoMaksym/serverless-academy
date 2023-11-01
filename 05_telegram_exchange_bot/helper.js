import axios from 'axios';
import os from 'node:os';
import NodeCache from 'node-cache';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'YOUR_API_KEY ';

const CITY = 'Delmenhorst';
const URL_WEATHER = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${WEATHER_API_KEY}`;
const URL_BANK_PRIVATE =
	'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';
const URL_BANK_MONO = 'https://api.monobank.ua/bank/currency';

const cacheOptions = { stdTTL: 60, checkperiod: 60 };
const myCache = new NodeCache(cacheOptions);
export const getWeatherForecast = async (chatId, intervalHours) => {
	const defaultInterval = 3;
	const interval = intervalHours / defaultInterval;
	const millisecondsInOneSecond = 1000;
	const hoursInOneDay = 24;
	const forecastLength = hoursInOneDay / defaultInterval + 1;

	const response = await axios.get(URL_WEATHER);
	const timezone = response.data.city.timezone;
	const sunrise = response.data.city.sunrise;
	const sunset = response.data.city.sunset;
	const forecasts = response.data.list;

	const title =
		`Weather forecast for ${CITY} at interval every ${intervalHours} hours` +
		os.EOL;
	const generalInfo =
		`Timezone ${timezone / 60 / 60} - Sunrise ${new Date(
			sunrise * millisecondsInOneSecond
		).toLocaleTimeString()} - Sunset ${new Date(
			sunset * millisecondsInOneSecond
		).toLocaleTimeString()}` + os.EOL;
	let message = title + generalInfo;

	for (let i = 0; i < forecastLength; i += interval) {
		const forecast = forecasts[i];

		const date = new Date(
			forecast.dt * millisecondsInOneSecond
		).toLocaleString();
		const temp = forecast.main.temp;
		const pressure = forecast.main.pressure;
		const weather = forecast.weather[0].main;
		const weatherDescription = forecast.weather[0].description;

		message += `${date}${os.EOL}Temperature: ${Math.round(
			temp
		)}. Pressure in bar- ${pressure} Weather - ${weather} / ${weatherDescription}${
			os.EOL
		}`;
	}
	return message;
};

export const getExchangeRatePrivate = async (currency) => {
	const title = `Exchange Rate PRIVATE BANK ${currency} to UAH ` + os.EOL;

	let data = myCache.get('dataPrivate');

	if (!data) {
		const responsePrivate = await axios.get(URL_BANK_PRIVATE);
		data = responsePrivate.data;
		myCache.set('dataPrivate', data, 60);
	}

	const [eurRate, usdRate] = data;

	const usdCode = usdRate.ccy;
	const usdSale = usdRate.buy.slice(0, 5);
	const usdBuy = usdRate.sale.slice(0, 5);

	const eurCode = eurRate.ccy;
	const eurSale = eurRate.buy.slice(0, 5);
	const eurBuy = eurRate.sale.slice(0, 5);

	const USD = template(usdCode, usdSale, usdBuy);
	const EUR = template(eurCode, eurSale, eurBuy);
	return { EUR, USD, title };
};

export const getExchangeRateMono = async (currency) => {
	const title_MONO = `Exchange Rate MONO BANK ${currency} to UAH ` + os.EOL;

	const EUR_ISO_CODE = 978;
	const USD_ISO_CODE = 840;
	const UAH = 980;

	let data = myCache.get('dataMono');

	if (!data) {
		const responseMono = await axios.get(URL_BANK_MONO);
		data = responseMono.data;
		myCache.set('dataMono', data, 60);
	}

	const [usdRate, eurRate] = data;

	const usdCode = usdRate.currencyCodeA === USD_ISO_CODE ? 'USD' : '???';
	const usdSale = usdRate.rateBuy.toFixed(2);
	const usdBuy = usdRate.rateSell.toFixed(2);

	const eurCode = eurRate.currencyCodeA === EUR_ISO_CODE ? 'EUR' : '???';
	const eurSale = eurRate.rateBuy.toFixed(2);
	const eurBuy = eurRate.rateSell.toFixed(2);

	const USD_MONO = template(usdCode, usdSale, usdBuy);
	const EUR_MONO = template(eurCode, eurSale, eurBuy);
	return { EUR_MONO, USD_MONO, title_MONO };
};

function template(code, sale, buy) {
	const e1 = ' |---------------|-----------|------------|' + os.EOL;
	const e2 = '| Currency |   Buy    |   Sale     |' + os.EOL;
	const e3 = '|---------------|-----------|------------|' + os.EOL;
	const e4 = `|      ${code}     |  ${buy}  |  ${sale}   |` + os.EOL;
	const e5 = '|---------------|-----------|------------|' + os.EOL;
	const template = e1 + e2 + e3 + e4 + e5;
	return template;
}
