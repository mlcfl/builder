import {program} from 'commander';
import {Validator, Modes, ModeOptions} from '~/services';
import {commanderOptions, CommanderOptionsTypes} from '~/utils';
import {config} from '~/config';

const {apps} = config;

const getDescription = (mode: ModeOptions): string => {
	const opening = mode === ModeOptions.Dev ? 'Builds and starts' : 'Starts';
	return `${opening} the project in ${Modes.getHumanText(mode)}.`;
};

/**
 * Special import
 * Parse cli arguments, check them and return
 */
export const handleCliArgs = (innerCall?: boolean): CommanderOptionsTypes.Start => {
	// Do not parse again without "watch" mode
	const existentArgs = program.opts<CommanderOptionsTypes.Start>();

	if (Object.keys(existentArgs).length) {
		return existentArgs;
	}

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

	const args = program.parse().opts<CommanderOptionsTypes.Start>();
	Validator.checkArguments(args);

	// To avoid duplicates, when is called without "watch" mode
	const copy = {...args};

	if (args.include) {
		copy.include = [...new Set(args.include)];
	}

	if (args.exclude) {
		copy.exclude = [...new Set(args.exclude)];
	}

	// Disable the second check
	if (!innerCall) {
		const cliApps = copy.include ?? copy.exclude ?? [];
		Validator.checkNonExistentApps(apps, cliApps);
	}

	return copy;
};
