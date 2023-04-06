import {Console, CliArgs, CliModes} from '~/services';
import {build} from '../build';
import {bootProject} from './bootProject';

/**
 * Start without "watch" mode
 */
export const run = async (args: CliArgs.Start): Promise<void> => {
	const {mode} = args;

	if (mode === CliModes.Dev) {
		await build(args);
	}

	Console.info('The project has been started.');
	await bootProject(args);
};
