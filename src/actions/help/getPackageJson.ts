import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {Fs} from '~/services';

/**
 * Return package.json
 *
 * "import json from '../package.json';" breaks "build:builder" action
 */
export const getPackageJson = async (): Promise<{scripts: Record<string, string>}> => {
	const path = join(Fs.absoluteRootPath, 'builder/package.json');
	const file = await readFile(path, {encoding: 'utf8'});

	return JSON.parse(file);
};
