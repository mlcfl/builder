import {readdir} from 'node:fs/promises';
import {program} from 'commander';
import {Console, Fs, Validator} from './services';
import {commanderOptions, CommanderOptionsTypes, basicStructure} from './utils';
import {cloneRepositories} from './actions/install';
import {config} from './config';

const {projectName} = config;

/**
 * Check files count in the root directory after installation
 */
const checkFilesCount = async (): Promise<void> => {
	const maxFilesCount = [5, 6];// 6 if ".github" directory exists
	const {length} = await readdir(Fs.absoluteRootPath);

	if (!maxFilesCount.includes(length)) {
		Console.warning(`Hmm, I expected ${maxFilesCount.join(' or ')} files in the root project directory, but you have ${length}. Why so, dear? 🙃`);
	}
};

/**
 * Installation process
 */
const install = async (apps: CommanderOptionsTypes.IncludeExclude): Promise<void> => {
	// Create a basic strusture of the project
	await Fs.createTree(Fs.absoluteRootPath, basicStructure);

	await cloneRepositories(apps);
	await checkFilesCount();

	Console.success(`Project ${projectName} was successfully installed. Use the "build" command to build the project and then use the "start" command to run it.`);
};

/**
 * Entry
 */
const {
	include: optionInclude,
	exclude: optionExclude,
} = commanderOptions;

const args = program
	.description(`Installs ${projectName}. Creates a directory structure and clones all required repositories from a remote git repository.`)
	.addOption(optionInclude)
	.addOption(optionExclude)
	.parse()
	.opts<CommanderOptionsTypes.IncludeExclude>();

Validator.checkArguments(args);
await install(args);
