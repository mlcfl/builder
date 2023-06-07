import {join} from 'node:path';
import shell from 'shelljs';
import chalk from 'chalk';
import {Fs, Console, type CliArgs} from '~/services';

/**
 * Help
 */
export const help = async (args: CliArgs.Help): Promise<void> => {
	const line = chalk.cyan(Array(10).fill('-').join(''));
	// "import json from '../package.json';" breaks "build:builder" action -> use readFile
	const path = join(Fs.absoluteRootPath, 'builder/package.json');
	const {scripts} = await Fs.readFile<{scripts: Record<string, string>}>(path);
	const ownActions = Object.values(scripts).filter(action => /^node dist\//.test(action));

	console.log(line);
	for (const action of ownActions) {
		const {code} = shell.exec(`${action} --help`);
		const success = code === 0;

		if (!success) {
			Console.error(`Something went wrong while running "${action}".`);
		}

		console.log(line);
	}
};
