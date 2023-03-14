import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {program} from 'commander';
import shell from 'shelljs';
import chalk from 'chalk';
import {Fs, Console} from './services';

/**
 * Entry
 */
program.description('Displays all available commands.').parse();
const line = chalk.cyan(Array(10).fill('-').join(''));

// Don't know why, but "import json from '../package.json';" breaks "build:builder" action
const path = join(Fs.absoluteRootPath, 'builder/package.json');
const file = await readFile(path, {encoding: 'utf8'});
const {scripts} = JSON.parse(file) as {scripts: Record<string, string>};

// Only own actions
const commands = Object.values(scripts).filter(action => /^node dist\//.test(action));

console.log(line);
for (const command of commands) {
	const {code} = shell.exec(`${command} --help`);
	const success = code === 0;

	if (!success) {
		Console.error(`Something went wrong while running "${command}".`);
	}

	console.log(line);
}
