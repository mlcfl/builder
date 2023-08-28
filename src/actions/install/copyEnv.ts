import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {Console, Fs, CliModes} from '~/services';

/**
 * Copy env files if they don't exist
 */
export const copyEnv = async () => {
	const dirSrc = join(Fs.absoluteRootPath, 'builder/src/env');
	const dirDist = join(Fs.absoluteRootPath, 'builder/dist/env');
	const defaultEnvPath = join(dirSrc, '.env.example');
	const defaultEnv = await Fs.readFile(defaultEnvPath, false);

	for (const mode of Object.values(CliModes)) {
		const file = `.env.${mode}`;
		const distSrc = join(dirSrc, file);
		const distDist = join(dirDist, file);

		const env = defaultEnv.replace('MODE=production', `MODE=${{
			dev: 'development',
			test: 'test',
			prod: 'production',
		}[mode]}`);

		if (!(await Fs.exists(distSrc))) {
			await writeFile(distSrc, env);
		}

		if (!(await Fs.exists(distDist))) {
			await writeFile(distDist, env);
		}

		Console.info(`Env file "${file}" was created.`);
	}
};
