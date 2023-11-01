import axios from 'axios';
import os from 'node:os';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'YOUR_API_KEY ';
const CITY = 'Delmenhorst';
const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${WEATHER_API_KEY}`;

export const getWeatherForecast = async (chatId, intervalHours) => {
	const defaultInterval = 3;
	const interval = intervalHours / defaultInterval;
	const millisecondsInOneSecond = 1000;
	const hoursInOneDay = 24;
	const forecastLength = hoursInOneDay / defaultInterval + 1;

	const response = await axios.get(URL);
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
