import {join} from 'node:path';
import {copyFile, constants} from 'node:fs/promises';
import {Console, Fs, CliModes} from '~/services';

/**
 * Copy env files if they don't exist
 */
export const copyEnv = async () => {
	const {COPYFILE_EXCL} = constants;
	const dirSrc = join(Fs.absoluteRootPath, 'builder/src/env');
	const dirDist = join(Fs.absoluteRootPath, 'builder/dist/env');
	const defaultEnv = join(dirSrc, '.env.example');

	for (const mode of Object.values(CliModes)) {
		try {
			const file = `.env.${mode}`;
			await copyFile(defaultEnv, join(dirSrc, file), COPYFILE_EXCL);
			await copyFile(defaultEnv, join(dirDist, file), COPYFILE_EXCL);
			Console.info(`Env file "${file}" was created.`);
		} catch (e) {
			const fileExistsError = e instanceof Error && 'code' in e && e.code === 'EEXIST';

			if (!fileExistsError) {
				throw e;
			}
		}
	}
};
