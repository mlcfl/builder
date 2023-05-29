import chalk from 'chalk';

/**
 * Colored console outputs
 */
export class Console {
	static success(text: string): void {
		console.log(chalk.green(`Success: ${text}`));
	}

	static warning(text: string): void {
		console.warn(chalk.yellow(`Warning: ${text}`));
	}

	static error(text: string): never
	static error(text: string, doNotEmitError: boolean): void
	static error(text: string, doNotEmitError?: boolean): void | never {
		if (doNotEmitError) {
			console.error(chalk.red(`Error: ${text}`));
		} else {
			throw new Error(chalk.red(text));// The error object is already prefixed with "Error:"
		}
	}

	static info(text: string): void {
		console.info(chalk.blueBright(text));
	}

	static log(...any: unknown[]): void {
		console.log(...any);
	}
}
