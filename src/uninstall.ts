import {join, basename} from 'node:path';
import {readdir, rm} from 'node:fs/promises';
import {exit} from 'node:process';
import {program} from 'commander';
import {Console, Fs} from './services';
import {commanderOptions, basicStructure} from './utils';
import {readline, askReallyDelete, askDeletePersonal} from './actions/uninstall';
import {config} from './config';

const {projectName, projectRootDirName} = config;
const dataDir = 'data';
const dirsToRemove = basicStructure.flatMap((item) => typeof item === 'string' ? item : Object.keys(item));

/**
 * Entry
 */
const {reinstall} = program
	.description(`Uninstalls ${projectName}. Deletes all directories except "builder" and ".github" (if you have it). You can choose to keep your personal data. Also it doesn't delete other files in the "${projectRootDirName}" directory.`)
	.addOption(commanderOptions.reinstall)
	.parse()
	.opts<{readonly reinstall?: boolean}>();

const rootDirName = basename(Fs.absoluteRootPath);
if (rootDirName !== projectRootDirName) {
	Console.error(`The root directory name is not equal to the project name. Need "${projectRootDirName}", but "${rootDirName}" found.`);
}

const reallyDelete = await askReallyDelete(reinstall);
if (!reallyDelete) {
	readline.close();
	Console.success('Operation canceled.');
	exit();
}

const deletePersonal = await askDeletePersonal(reinstall);
readline.close();

// Deleting
for (const dir of await readdir(Fs.absoluteRootPath)) {
	if (!dirsToRemove.includes(dir)) {
		continue;
	}

	if (dir !== dataDir || (dir === dataDir && deletePersonal)) {
		await rm(join(Fs.absoluteRootPath, dir), {recursive: true, force: true});
	}
}

if (reinstall) {
	Console.success(`Project ${projectName} was successfully uninstalled.`);
} else {
	Console.success(`Project ${projectName} was successfully uninstalled. Now all you have to do is delete the "builder" and ".github" directories (if you have them).`);
}
