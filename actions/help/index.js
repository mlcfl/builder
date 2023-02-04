import chalk from 'chalk';
import {data} from './data.js';

/**
 * Entry
 */
console.log(chalk.hex('FF92A5')('npm scripts description'));

data.forEach(({command, options, description}) => {
	console.log(chalk.blue.bold(command));
	options?.forEach((option) => console.log('\t', chalk.yellow.italic(option)));
	console.log(description);
	console.log('');
});
