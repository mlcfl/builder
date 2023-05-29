import {stdin, stdout} from 'node:process';
import {createInterface} from 'node:readline/promises';
import {checkProjectName} from './checkProjectName';
import {askReallyDelete} from './askReallyDelete';
import {askDeletePersonal} from './askDeletePersonal';
import {remove} from './remove';
import {Console, type CliArgs} from '~/services';
import {config} from '~/config';

/**
 * Uninstallation process
 */
export const uninstall = async (args: CliArgs.Uninstall): Promise<void> => {
	checkProjectName();

	const {reinstall} = args;
	const {projectName} = config;
	const readline = createInterface({input: stdin, output: stdout});
	const reallyDelete = await askReallyDelete(readline, args);

	if (!reallyDelete) {
		readline.close();
		Console.success('Operation canceled.');
		return;
	}

	const deletePersonal = await askDeletePersonal(readline, args);
	readline.close();

	await remove(deletePersonal);

	if (reinstall) {
		Console.success(`Project ${projectName} was successfully uninstalled.`);
	} else {
		Console.success(`Project ${projectName} was successfully uninstalled. Now all you have to do is delete the "builder" and ".github" directories (if you have them).`);
	}
};
