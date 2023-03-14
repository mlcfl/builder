import {join} from 'node:path';
import {program} from 'commander';
import {Validator, Modes, ModeOptions, Fs, Console} from './services';
import {commanderOptions} from './utils';
import {config} from './config';
import {env} from './env';

const getDescription = (mode: ModeOptions) => {
	const opening = mode === ModeOptions.Dev ? 'Builds and starts' : 'Starts';
	return `${opening} the project in ${Modes.getHumanText(mode)}.`;
};

/**
 * Entry
 */
const {
	include: optionInclude,
	exclude: optionExclude,
	watch: optionWatch,
	mode: optionMode,
} = commanderOptions;

const mode = Modes.getCurrent(optionMode);
program
	.description(getDescription(mode))
	.addOption(optionInclude)
	.addOption(optionExclude)
	.addOption(optionMode);

if (mode === ModeOptions.Dev) {
	program.addOption(optionWatch);
}

const args = program.parse().opts();
Validator.checkArguments(args);

// Dynamic import to exclude from the "build:builder" compilation process
const pathToEntryPoint = join(Fs.absoluteRootPathDi, 'common/common-backend/dist/index.js');

try {
	const {boot} = await import(pathToEntryPoint);

	boot({env: env(mode), config});
} catch (e) {
	if (e instanceof Error && 'code' in e) {
		if (e.code === 'ERR_MODULE_NOT_FOUND') {
			Console.error(`The entry point on path "${pathToEntryPoint}" not found. Perhaps you forgot to build the project with the "build" action.`);
		}
	}

	throw e;
}
