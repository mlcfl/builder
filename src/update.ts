import {program} from 'commander';
import {Console, Validator} from './services';
import {commanderOptions, CommanderOptionsTypes} from './utils';
import {pullBuilder, pullDocuments, pullCommon, pullApps} from './actions/update';
import {config} from './config';

const {projectName} = config;

/**
 * Update process
 */
const update = (apps: CommanderOptionsTypes.IncludeExclude): void => {
	pullBuilder();
	pullDocuments();
	pullCommon();
	pullApps(apps);

	Console.warning(`The "pnpm install" command wasn't called for all required directories, you have to call it manually. The final structure of the project hasn't been defined yet and the author doesn't know where to call this command.`);
	Console.success(`Project ${projectName} was successfully updated. Use the "build" command to build the project and then use the "start" command to run it.`);
};

/**
 * Entry
 */
const {
	include: optionInclude,
	exclude: optionExclude,
} = commanderOptions;

const args = program
	.description('Updates the entire infrastructure of the project. Calls "git pull" on the "builder", "documents" and other directories. Then calls "pnpm install" for all required directories.')
	.addOption(optionInclude)
	.addOption(optionExclude)
	.parse()
	.opts<CommanderOptionsTypes.IncludeExclude>();

Validator.checkArguments(args);
update(args);
