import inquirer from 'inquirer';
import fs from 'fs/promises';
import os from 'node:os';

const questions = [
	{
		type: 'input',
		name: 'name',
		message: 'What is your name? To cancel press ENTER:',
	},
	{
		type: 'list',
		name: 'gender',
		message: 'What is your gender?',
		choices: ['Male', 'Female', 'Other'],
		when(answer) {
			if (answer.name.length < 1) {
				return false;
			}
			return true;
		},
	},
	{
		type: 'input',
		name: 'age',
		message: 'How old are you?',
		default: 1,
		validate(value) {
			const valid = !isNaN(parseFloat(value));
			return valid || 'Please enter a number';
		},
		filter: Number,
		when(answer) {
			if (answer.name.length < 1) {
				return false;
			}
			return true;
		},
	},
];
const questions2 = [
	{
		type: 'confirm',
		name: 'confirmed',
		message: 'Wold you like search user in database?',
		transformer: (answer) => (answer ? '👍' : '👎'),
	},
	{
		type: 'input',
		name: 'request',
		message: 'Enter name of user you wanna find in DB',
		when(answer) {
			if (answer.confirmed === '👎') {
				return false;
			}
			return true;
		},
	},
];

const usersToDatabase = async () => {
	try {
		const answers = await inquirer.prompt(questions);

		if (answers.name) {
			//write to file.txt & repeat questions
			const data = JSON.stringify(answers) + os.EOL;
			await fs.writeFile('dataBase.txt', data, { flag: 'a+' });
			usersToDatabase();
		} else {
			//search in database
			const answers2 = await inquirer.prompt(questions2);

			if (answers2.request) {
				const data = await fs.readFile('dataBase.txt', {
					encoding: 'utf8',
				});

				const arr = data.split(os.EOL);

				const user = arr.find((el) => {
					const object = JSON.parse(el);
					return object.name.toLowerCase() === answers2.request.toLowerCase();
				});

				user
					? console.log(JSON.parse(user))
					: console.log('User does not exist');
			}
		}
	} catch (error) {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
			console.log(error);
		}
	}
};
usersToDatabase();
