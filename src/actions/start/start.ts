import {join} from 'node:path';
import {Fs, Console} from '~/services';
import {CommanderOptionsTypes} from '~/utils';
import {config} from '~/config';
import {env} from '~/env';

export const start = async (args: CommanderOptionsTypes.Start): Promise<void> => {
	const {mode} = args;
	// Dynamic import to exclude from the "build:builder" compilation process
	const pathToEntryPoint = join(Fs.absoluteRootPathDi, 'common/common-backend/dist/index.js');

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
				Console.error(`The entry point on path "${pathToEntryPoint}" not found. Perhaps you forgot to build the project with the "build" action.`);
			}

			// Any other codes...
		}

		throw e;
	}
};
