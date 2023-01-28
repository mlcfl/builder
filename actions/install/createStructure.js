import {join} from 'path';
import {createDir} from '../../utils/createDir.js';

// Project basic structure
const structure = [
	{
		dist: [
			'dev',
			'test',
			'prod',
		],
		data: [
			'dev',
			'test',
			'prod',
		],
		src: [
			'apps',
			'common',
		],
	}
];

// Create a basic strusture of the project
export const createStructure = async (path, array = structure) => {
	for (const dir of array) {
		if (typeof dir === 'string') {
			await createDir(join(path, dir));
			continue;
		}

		for (const key in dir) {
			const newPath = join(path, key);
			await createDir(newPath);
			await createStructure(newPath, dir[key]);
		}
	}
};
