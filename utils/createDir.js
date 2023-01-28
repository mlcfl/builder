import {constants, promises} from 'fs';
import {warning} from './console.js';

const {mkdir, access} = promises;

export const createDir = async (path) => {
	try {
		// If exists, send warning
		await access(path, constants.F_OK);
		warning(`Folder "${path}" already exists. Nothing bad, but it would be nice to check its permissions.`);
	} catch (e) {
		// Doesn't exist, create
		await mkdir(path);
	}
};
