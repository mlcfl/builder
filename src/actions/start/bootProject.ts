import {join} from 'node:path';
import {Fs, Console, CliArgs, CliModes} from '~/services';
import {config} from '~/config';
import {env} from '~/env';

/**
 * The main start point
 */
export const bootProject = async (args: CliArgs.Start): Promise<void> => {
	const {mode} = args;
	// Dynamic import to exclude from the "build:builder" compilation process
	const pathToEntryPoint = join(Fs.absoluteRootPathDi, 'common/common-backend/dist/boot.js');

	try {
		const {boot} = await import(pathToEntryPoint);

		await boot({
			env: env(mode),
			cliArgs: args,
			config,
		});
	} catch (e) {
		/**
		 * What errors can be handled here?
		 * - Node.js errors, permissions, errors before starting the server, database connection errors, etc.
		 * - Not errors at the "application" level, when the server was already started.
		 */
		if (e instanceof Error && 'code' in e) {
			if (e.code === 'ERR_MODULE_NOT_FOUND') {
				Console.error(`The entry point on path "${pathToEntryPoint}" not found. Perhaps you forgot to build the project with the "build" action. The error message: ${e.message}`);
			}

			// Any other codes...
		}

		// Stop dev server if error, but not test or prod
		if (mode === CliModes.Dev) {
			throw e;
		} else {
			Console.error(`[critical] ${e instanceof Error ? e.message : String(e)}`, true);
		}
	}
};
