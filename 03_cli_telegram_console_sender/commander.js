import { Command } from 'commander';
import fs from 'fs/promises';
import { createReadStream } from 'fs';

import { bot } from './index.js';

bot.on('close', () => {
	process.exit(1);
});

let database = null;

try {
	database = await fs.readFile('./database.json', {
		encoding: 'utf8',
		flag: 'a+',
	});

	database = database && JSON.parse(database);

	if (!database) {
		database = { userId: [] };
	}
} catch (error) {
	console.log(error);
}

const program = new Command();

program
	.name('telegram_console_sender')
	.description('cli_telegram_console_sender')
	.version('0.0.1');

program
	.command('send-message')
	.description('Send message to Telegram bot from your PC')
	.argument('<message>', 'string to send')
	.action((message) => {
		try {
			bot.onText(/\/start/, async function (msg, match) {
				const fromId = msg.from.id; // Receive user`s ID

				if (database.userId.includes(fromId)) {
					return;
				}
				database.userId.push(fromId);
				const databaseJSON = JSON.stringify(database);
				await fs.writeFile('./database.json', databaseJSON, {
					flag: 'w+',
				});
				await bot.sendMessage(fromId, message);
				bot.emit('close');
			});

			database.userId?.forEach(async (fromId) => {
				await bot.sendMessage(fromId, message);
				bot.emit('close');
			});
		} catch (error) {
			console.log(error);
		}
	});

program
	.command('send-photo')
	.description('Send photo to Telegram bot from your PC')
	.argument('<path>', 'path to picture')
	.action((path) => {
		try {
			const stream = createReadStream(path);

			database.userId?.forEach(async (fromId) => {
				const fileOptions = {};
				await bot.sendPhoto(fromId, stream, {}, fileOptions);
			});
			bot.emit('close');
		} catch (error) {
			console.log(error);
		}
	});
program.parse();
