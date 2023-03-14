import {argv} from 'node:process';
import {Option} from 'commander';
import {Console} from './Console';

export enum ModeOptions {
	Dev = 'dev',
	Test = 'test',
	Prod = 'prod',
};

export type ModeKeys = keyof typeof ModeOptions;
export type ModeValues = `${ModeOptions}`;

/**
 * Environment modes
 */
export class Modes {
	private static _array: ModeOptions[];

	/**
	 * As array of values
	 */
	static toArray(): ModeOptions[] {
		return this._array ?? (this._array = Object.values(ModeOptions));
	}

	/**
	 * Return human-understandable mode ending
	 */
	static getHumanText(mode: ModeOptions): string {
		return {
			[ModeOptions.Dev]: 'development mode',
			[ModeOptions.Test]: 'production mode with configuration for test server',
			[ModeOptions.Prod]: 'production mode',
		}[mode];
	}

	/**
	 * Return current mode from process.argv
	 */
	static getCurrent(cliOption: Option): ModeOptions {
		const {long, short} = cliOption;
		const index = argv.findIndex(val => [short, long].includes(val));

		if (index === -1) {
			Console.error(`Invalid environment mode. Required option "${short}, ${long}" is missing.`);
		}

		const mode = argv[index + 1] as ModeOptions;

		if (!this.toArray().includes(mode)) {
			Console.error(`Invalid environment mode. Available "${this.toArray().join(', ')}", but "${mode}" found.`);
		}

		return mode;
	}
}
