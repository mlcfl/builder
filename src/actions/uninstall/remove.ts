import {readdir, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {Fs} from '~/services';
import {basicStructure} from '~/utils';

/**
 * Deleting
 */
export const remove = async (deletePersonal: boolean): Promise<void> => {
	const dataDir = 'data';
	const dirsToRemove = basicStructure.flatMap((item) => typeof item === 'string' ? item : Object.keys(item));

	for (const dir of await readdir(Fs.absoluteRootPath)) {
		if (!dirsToRemove.includes(dir)) {
			continue;
		}

		if (dir !== dataDir || (dir === dataDir && deletePersonal)) {
			await rm(join(Fs.absoluteRootPath, dir), {recursive: true, force: true});
		}
	}
};
