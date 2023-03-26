import {program} from 'commander';
import {Validator, Modes} from './services';
import {commanderOptions, CommanderOptionsTypes} from './utils';
import {build} from './actions/build';

/**
 * Parse cli arguments, check them and return
 */
const handleCliArgs = (): CommanderOptionsTypes.Build => {
	// Do not parse again if called in the "start:dev" action
	const existentArgs = program.opts<CommanderOptionsTypes.Build>();

	if (Object.keys(existentArgs).length) {
		return existentArgs;
	}

	const {
		include: optionInclude,
		exclude: optionExclude,
		mode: optionMode,
	} = commanderOptions;

	const mode = Modes.getCurrent(optionMode);
	const args = program
		.description(`Builds the project in ${Modes.getHumanText(mode)}.`)
		.addOption(optionInclude)
		.addOption(optionExclude)
		.addOption(optionMode)
		.parse()
		.opts<CommanderOptionsTypes.Build>();

	Validator.checkArguments(args);

	return args;
};

/**
 * Entry
 */
const args = handleCliArgs();
const {watcherBackend} = await build(args);

export {
	watcherBackend,
};
