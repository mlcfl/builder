import {stdin, stdout} from 'process';
import {createInterface} from 'readline/promises';
import {readdir, rm} from 'fs/promises';
import {join, basename} from 'path';
import chalk from 'chalk';
import {error, success} from '../../utils/console.js';
import {absolutePathToApp} from '../../utils/absolutePathToApp.js';
import {config} from '../../utils/config.js';

const {githubName, appName} = config;
const attention = (text) => chalk.bold.underline(text);

/**
 * Entry
 */
(async () => {
	const foldersToRemove = ['src', 'dist', 'data', 'documents'];
	const rootFolderName = basename(absolutePathToApp);
	const rl = createInterface({input: stdin, output: stdout});
	const deleteAll = await rl.question(`Are you sure you want to delete ${attention('the whole')} application? [Y/${attention('N')}] `);

	if (!/^(?:y|yes)$/i.test(deleteAll)) {
		rl.close();
		success('Operation canceled.');
		return;
	}

	const deletePersonal = await rl.question(`Do you want to delete ${attention('your personal data')}? [Y/${attention('N')}] `);
	const deletePersonalData = /^(?:y|yes)$/i.test(deletePersonal);
	rl.close();

	if (rootFolderName !== githubName) {
		error(`The root folder name is not equal to the application name. Need "${githubName}", but "${rootFolderName}" found.`);
		return;
	}

	// Deleting
	for (const folder of await readdir(absolutePathToApp)) {
		if (!foldersToRemove.includes(folder)) {
			continue;
		}

		if (folder !== 'data' || (folder === 'data' && deletePersonalData)) {
			await rm(join(absolutePathToApp, folder), {recursive: true, force: true});
		}
	}

	success(`Application ${appName} was successfully uninstalled. Now all you have to do is delete the "builder" and ".github" folders (if you have them).`);
})();
