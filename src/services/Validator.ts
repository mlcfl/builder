import {Console} from './Console';
import {commanderOptions, CommanderOptionsTypes} from '../utils';

/**
 * Makes some checks
 */
export class Validator {
	/**
	 * Check that passed applications exist
	 */
	static checkNonExistentApps(standard: string[], toCheck: string[]): void {
		if (!toCheck.length) {
			return;
		}

		const nonExistentApps = toCheck.filter(app => !standard.includes(app));
		const {length} = nonExistentApps;
		const appText = length > 1 ? 'applications' : 'application';
		const dontText = length > 1 ? "don't" : "doesn't";

		length && Console.warning(`Passed ${appText} "${nonExistentApps.join(', ')}" ${dontText} exist and will be omitted.`);
	}

	/**
	 * Check for invalid argument values
	 */
	static checkArguments<T extends object>(args: T): void {
		if ('include' in args && 'exclude' in args) {
			const {include, exclude} = commanderOptions;
			Console.error(`Do not use together "${include.long}" and "${exclude.long}".`);
		}
	}

	/**
	 * Skip app if it matches
	 */
	static skipApp(app: string, {include, exclude}: CommanderOptionsTypes.IncludeExclude): boolean {
		return Boolean(
			(include && !include.includes(app))
			|| (exclude && exclude.includes(app))
		);
	}
}
