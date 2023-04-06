import {basename} from 'node:path';
import {Fs, Console} from '~/services';
import {config} from '~/config';

/**
 * Check the root directory name with the name from the config
 */
export const checkProjectName = (): void => {
	const {projectRootDirName} = config;
	const rootDirName = basename(Fs.absoluteRootPath);

	if (rootDirName !== projectRootDirName) {
		Console.error(`The root directory name is not equal to the project name. Need "${projectRootDirName}", but "${rootDirName}" found.`);
	}
};
