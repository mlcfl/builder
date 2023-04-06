import {copyEnv} from './copyEnv';
import {cloneRepositories} from './cloneRepositories';
import {initPnpm} from './initPnpm';
import {checkFilesCount} from './checkFilesCount';
import {Console, Fs, CliArgs} from '~/services';
import {basicStructure} from '~/utils';
import {config} from '~/config';

/**
 * Installation process
 */
export const install = async (args: CliArgs.Install): Promise<void> => {
	const {projectName} = config;

	// Create a basic structure of the project
	await Fs.createTree(Fs.absoluteRootPath, basicStructure);
	Console.info('The basic structure of the project was created.');

	await copyEnv();
	await cloneRepositories(args);
	await initPnpm(args);
	await checkFilesCount();

	Console.success(`Project ${projectName} was successfully installed. Use the "build" command to build the project and then use the "start" command to run it.`);
};
