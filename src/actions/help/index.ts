import shell from 'shelljs';
import chalk from 'chalk';
import {Console, CliArgs} from '~/services';
import {getPackageJson} from './getPackageJson';

/**
 * Help
 */
export const help = async (args: CliArgs.Help): Promise<void> => {
	const line = chalk.cyan(Array(10).fill('-').join(''));
	const {scripts} = await getPackageJson();
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
