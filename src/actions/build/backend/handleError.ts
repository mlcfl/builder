import {exit} from 'node:process';
import chalk from 'chalk';

export type Options<T> = {
	alreadyShown: T[],
	firstBuild: boolean,
};

const defaultOptions: Options<never> = {
	alreadyShown: [],
	firstBuild: true,
};

/**
 * Show or throw
 */
export const handleError = <T>(e: T, options: Options<T | string> = defaultOptions): (T | string)[] => {
	const {alreadyShown, firstBuild} = options;
	let isString = false;
	let error: T | string;

	// Try to stringify
	if (e instanceof Error) {
		const {name, message} = e;
		const code = 'code' in e ? `(code ${e.code})` : '';
		const plugin = 'plugin' in e ? `(plugin ${e.plugin})` : '';
		const intro = [name, code, plugin].join(' ') + ':\n';
		const text = chalk.red(intro) + message;

		error = text;
		isString = true;
	} else {
		error = e;
	}

	// Do not duplicate errors
	if (alreadyShown.includes(error)) {
		return alreadyShown;
	}

	// If it's the first build before staring nodemon, throw an error and exit
	if (firstBuild) {
		if (isString) {
			console.error(error);
			exit(1);
		}

		throw e;
	}

	console.error(isString ? error : String(error));
	alreadyShown.push(error);

	// Return updated array
	return alreadyShown;
};
