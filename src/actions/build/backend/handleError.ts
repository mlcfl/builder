import {exit} from 'node:process';
import chalk from 'chalk';

type Options = {
	alreadyShown: unknown[],
	firstBuild: boolean,
};

/**
 * Show or throw
 */
export const handleError = (
	e: unknown,
	{alreadyShown, firstBuild}: Options = {alreadyShown: [], firstBuild: true}
): unknown[] => {
	let isString = false;
	let error;

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
