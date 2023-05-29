import {argv} from 'node:process';
import {program} from 'commander';
import {Modes} from './Modes';
import {Actions} from './Actions';
import {Arguments} from './Arguments';
import {settings} from './settings';
import {options as allOptions} from './options';
import {Console} from '../Console';
import {Entries} from '~/utils';
import {config} from '~/config';

/**
 * Work with cli
 */
export class Cli {
	private static _mute = false;

	/**
	 * Return all actions
	 */
	static get Actions(): typeof Actions {
		return Actions;
	}

	/**
	 * Disable all console outputs except errors
	 */
	static get mute() {
		this._mute = true;

		return {handleArgs: this.handleArgs.bind(this)};
	}

	/**
	 * Parse cli arguments, check them and return only available ones
	 */
	static handleArgs<T extends Arguments.Help>(action: Actions.Help): T
	static handleArgs<T extends Arguments.Install>(action: Actions.Install): T
	static handleArgs<T extends Arguments.Uninstall>(action: Actions.Uninstall): T
	static handleArgs<T extends Arguments.Reinstall>(action: Actions.Reinstall): T
	static handleArgs<T extends Arguments.Update>(action: Actions.Update): T
	static handleArgs<T extends Arguments.Test>(action: Actions.Test): T
	static handleArgs<T extends Arguments.Build>(action: Actions.Build): T
	static handleArgs<T extends Arguments.Start>(action: Actions.Start): T
	static handleArgs<T extends Arguments.All>(action: Actions): T {
		// Do not parse again
		const existentArgs = program.opts<T>();
		if (Object.keys(existentArgs).length) {
			return existentArgs;
		}

		const {description, options} = settings[action];
		const needMode = typeof description === 'function';
		let mode: Modes;
		let text: string;

		if (needMode) {
			mode = this.getCurrentMode();
			text = description(mode);
		} else {
			text = description;
		}

		// Add description
		program.description(text);

		// Add options
		const {watch} = allOptions;
		options.forEach(option => {
			if (option !== watch || (option === watch && mode === Modes.Dev)) {
				program.addOption(option);
			}
		});

		// Parse
		const args = program.parse().opts<T>();
		this.checkArguments(args);
		this.removeDuplicates(args);

		return this.filterNonExistentValues(args);
	}

	/**
	 * Return current mode from process.argv
	 */
	private static getCurrentMode(): Modes {
		const {mode: {long, short}} = allOptions;
		const index = argv.findIndex(val => [short, long].includes(val));

		if (index === -1) {
			Console.error(`Invalid environment mode. Required option "${short}, ${long}" is missing.`);
		}

		const mode = argv[index + 1] as Modes;
		const modes = Object.values(Modes);

		if (!modes.includes(mode)) {
			Console.error(`Invalid environment mode. Available "${modes.join(', ')}", but "${mode}" found.`);
		}

		return mode;
	}

	/**
	 * Check for invalid argument values
	 */
	private static checkArguments<T extends Arguments.All>(args: T): void {
		if ('include' in args && 'exclude' in args) {
			const {include, exclude} = allOptions;
			Console.error(`Do not use together "${include.long}" and "${exclude.long}".`);
		}

		if ('includeParts' in args && 'excludeParts' in args) {
			const {includeParts, excludeParts} = allOptions;
			Console.error(`Do not use together "${includeParts.long}" and "${excludeParts.long}".`);
		}
	}

	/**
	 * Remove duplicates in array values from the passed object
	 */
	private static removeDuplicates<T extends Arguments.All>(args: T): void {
		const entries = Object.entries(args) as Entries<T>;

		for (const [key, val] of entries) {
			if (Array.isArray(val)) {
				args[key] = [...new Set(val)] as T[keyof T];
			}
		}
	}

	/**
	 * Filter non-existent values
	 */
	private static filterNonExistentValues<T extends Arguments.All>(args: T): T {
		const {strict} = args as {strict?: boolean};
		const {apps, parts: {app, common}} = config;
		const flatApps = apps.map(i => Array.isArray(i) ? i[0] : i);
		const allParts = [...new Set([...app, ...common])];
		const allKeys = [
			['include', 'exclude'],
			['includeParts', 'excludeParts'],
		];

		allKeys.forEach((keys, i) => {
			const isPart = Boolean(i);
			const text = isPart ? 'part' : 'application';
			const standart = isPart
				? (strict ? allParts : app)
				: (strict ? [...flatApps, 'common', 'documents', 'builder'] : flatApps);

			for (const key of keys) {
				const k = key as keyof T;
				const values = args[k] as string[];
				const isArray = Array.isArray(values) && values.length > 0;

				if (!isArray) {
					continue;
				}

				const [existent, nonExistent] = values.reduce<[string[], string[]]>((result, val) => {
					standart.includes(val) ? result[0].push(val) : result[1].push(val);
					return result;
				}, [[], []]);
				const {length} = nonExistent;

				if (!this._mute && length) {
					const dontText = length > 1 ? "don't" : "doesn't";
					const ending = length > 1 ? 's' : '';
					Console.warning(`Passed ${text}${ending} "${nonExistent.join(', ')}" ${dontText} exist and will be omitted.`);
				}

				args[k] = existent as T[keyof T];
			}
		});

		return args;
	}
}
