import {program} from 'commander';
import {Validator, Modes} from './services';
import {commanderOptions} from './utils';

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
	.opts();

Validator.checkArguments(args);

console.log('Action "build:*" is not implemented yet');
