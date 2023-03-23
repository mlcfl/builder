import {program} from 'commander';
import {Validator, Modes} from './services';
import {commanderOptions, CommanderOptionsTypes} from './utils';
import {build} from './actions/build';

/**
 * Entry
 */
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
await build(args);
