import {argv} from 'process';
import {join} from 'path';
import {readdir} from 'fs/promises';
import shell from 'shelljs';
import {error, success, warning} from '../../utils/console.js';
import {absolutePathToApp} from '../../utils/absolutePathToApp.js';
import {config} from '../../utils/config.js';

const flagInclude = '--include';
const flagExclude = '--exclude';
const defaultArgvLength = 2;
const flagArgsCount = 2;
const {length} = argv;
const [, , flag, flagVal] = argv;

const {apps} = config;

/**
 * Go to folder
 */
const cd = (root, path = '') => {
	const fullPath = join(root, path);
	const {code} = shell.cd(fullPath);
	const success = code === 0;

	if (!success) {
		error(`Something went wrong with go to "${fullPath}" path. Probably it doesn't exist or you don't have enough permissions.`);
	}

	return success;
};

/**
 * Pull from GitHub
 *
 * @param {string} path
 *
 * @returns {boolean}
 */
const pull = (path) => {
	if (!cd(absolutePathToApp, path)) {
		return false;
	}

	const {code} = shell.exec('git pull');
	const success = code === 0;

	if (!success) {
		error(`Something went wrong with updating "${path}". Probably you don't have enough permissions to update it.`);
	}

	return success;
};

/**
 * Update builder & documents
 */
const pullMiddleware = (app) => pull(app) && (success(`Application "${app}" updated successfully.`) ?? true);

/**
 * Update src/common/*
 */
const updateCommon = async () => {
	const path = 'src/common';
	const maxFoldersCount = 6;// ['all', 'backend', 'frontend', 'tests', 'design', 'docs']
	const folders = await readdir(join(absolutePathToApp, path));

	if (folders.length > maxFoldersCount) {
		error(`No more than ${maxFoldersCount} folders in "${path}" was expected, but ${folders.length} found. Please, remove additional folders or files.`);
		return false;
	}

	for (const folder of folders) {
		if (!pull(`${path}/${folder}`)) {
			return false;
		}
	}

	success('Application "common" updated successfully.');
	return true;
};

/**
 * Application parts
 */
const appParts = [
	'common',
	'backend',
	'frontend',
	'tests',
	'design',
	'docs',
];

/**
 * Update src/apps/*
 *
 * @param {string[]} [cliApps]
 * @param {boolean} [flagInclude]
 *
 * @returns {boolean}
 */
const updateApps = (cliApps, flagInclude) => {
	// Passed applications exist
	if (cliApps) {
		const nonExistentApps = cliApps.filter(app => !apps.includes(app));
		nonExistentApps.length && warning(`Passed applications "${nonExistentApps.join(', ')}" don't exist and will be omitted.`);
	}

	return apps.reduce((ok, app) => {
		if (!ok) {
			return false;
		}

		// Skip app if it matches
		if (cliApps) {
			if ((flagInclude && !cliApps.includes(app)) || (!flagInclude && cliApps.includes(app))) {
				return true;
			}
		}

		// Pull
		const allUpdated = appParts.reduce((ok, part) => {
			return ok ? pull(`src/apps/${app}/${app}-${part}`) : false;
		}, true);

		allUpdated
			? success(`Application "${app}" updated successfully.`)
			: error(`Failed to fully update the application: "${app}". Action stopped.`);

		return allUpdated;
	}, true);
};

/**
 * Update process
 */
const update = async (apps, isFlagInclude) => {
	const allSuccess = pullMiddleware('builder')
		&& pullMiddleware('documents')
		&& await updateCommon()
		&& updateApps(apps, isFlagInclude);

	if (!allSuccess) {
		return;
	}

	warning(`"npm i" wasn't called for all required folders, you have to call it manually. The final structure of the application hasn't been defined yet and the author doesn't know where to call this command.`);
	success(`Application ${config.appName} was successfully updated. Use "npm run build" to build the application and then use "npm start" to run it.`);
};

/**
 * Entry
 */
(() => {
	if (length > defaultArgvLength + flagArgsCount) {
		error(`You are trying to use more than one flag. Do not use together "${flagInclude}" and "${flagExclude}".`);
		return;
	}

	// All
	if (length === defaultArgvLength) {
		update();
		return;
	}

	if (!flagVal) {
		error('Parameter for the flag is missing.');
		return;
	}

	const apps = flagVal.split(',');

	// Include
	if (flag === flagInclude) {
		update(apps, true);
		return;
	}

	// Exclude
	if (flag === flagExclude) {
		update(apps, false);
		return;
	}

	error(`Only "${flagInclude}" or "${flagExclude}" are available.`);
})();
