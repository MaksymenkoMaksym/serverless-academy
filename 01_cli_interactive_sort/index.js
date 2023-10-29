import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import os from 'node:os';

import { Sort } from './helper.js';

const rl = readline.createInterface({ input, output });

const greetings =
	'Hello. Enter enter a few words or numbers separated by a space.' + os.EOL;

const question = 'How would you like to sort values:' + os.EOL;
const one = '1. Sort words alphabetically [ A - Z ]' + os.EOL;
const two = '2. Show numbers from lesser to greater [ 0 - 10 ]' + os.EOL;
const three = '3. Show numbers from bigger to smaller  [ 10 - 1 ]' + os.EOL;
const forth = '4. Display words by number of letters in the word' + os.EOL;
const five = '5. Show only unique words' + os.EOL;
const six =
	'6. Display only unique values from the set of words and numbers entered by the user' +
	os.EOL;

const cli = async () => {
	const userInput = await rl.question(`${greetings}`);

	const arr = userInput.split(' ');

	const isNAN = arr.find((el) => isNaN(el));

	const sort = new Sort(arr, isNAN);

	let answer = await rl.question(
		`${question}${one}${two}${three}${forth}${five}${six}`
	);

	console.log(`You enter: ${answer}`);

	switch (answer) {
		case '1':
			const s1 = sort.alphabetically();
			console.log(s1);
			break;
		case '2':
			const s2 = sort.smallToBig();
			console.log(s2);
			break;
		case '3':
			const s3 = sort.bigToSmall();
			console.log(s3);
			break;
		case '4':
			const s4 = sort.wordsByLetters();
			console.log(s4);
			break;
		case '5':
			const s5 = sort.uniqueWords();
			console.log(s5);
			break;
		case '6':
			const s6 = sort.uniqueWords();
			console.log(s6);
			break;
		case 'exit':
			rl.on('close', () => {
				console.log('Bye! See you soon!');
				process.exit(0);
			});
			rl.close();
			break;
		default:
			console.log('Wrong command. Use only numbers  [ 1 - 5 ] OR exit');
			break;
	}
	cli();
};

cli();
