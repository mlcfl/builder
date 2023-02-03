import {join} from 'path';
import {existsSync} from 'fs';
import shell from 'shelljs';
import {createDir} from '../../utils/createDir.js';
import {error, warning, success} from '../../utils/console.js';
import {config} from '../../utils/config.js';

const {githubName, apps} = config;

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
 * Clone repository from GitHub
 */
const clone = (repository, rename = '') => {
	const url = `git clone https://github.com/${githubName}/${repository}.git ${rename}`;
	const {code} = shell.exec(url);
	const success = code === 0;

	if (!success) {
		error(`Something went wrong with cloning "${repository}". Probably it already exists or you don't have enough permissions to clone it.`);
	}

	return success;
};

/**
 * Clone "documents" repository
 */
const cloneDocuments = (path) => {
	const name = 'documents';

	if (existsSync(join(path, name))) {
		warning(`"${name}" repository already exists. Installation will continue, but the better way to use "npm run reinstall" command.`);
	}

	return cd(path) && clone(name);
};

/**
 * Clone "common" repositories
 */
const cloneCommon = (path) => {
	const parts = ['all', 'backend', 'frontend', 'tests', 'design', 'docs'];

	return cd(path, 'src/common') && parts.reduce((success, name) => {
		return success ? clone(`common-${name}`) : false;
	}, true);
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
 * Clone apps repositories
 *
 * @param {string} path
 * @param {string[]} [cliApps]
 * @param {boolean} [flagInclude]
 *
 * @returns {Promise<boolean>}
 */
const cloneApps = async (path, cliApps, flagInclude) => {
	// Passed applications exist
	if (cliApps) {
		const nonExistentApps = cliApps.filter(app => !apps.includes(app));
		nonExistentApps.length && warning(`Passed applications "${nonExistentApps.join(', ')}" don't exist and will be omitted.`);
	}

	// Clone
	return cd(path, 'src/apps') && await apps.reduce(async (okPromise, app) => {
		if (!await okPromise) {
			return Promise.resolve(false);
		}

		// Skip app if it matches
		if (cliApps) {
			if ((flagInclude && !cliApps.includes(app)) || (!flagInclude && cliApps.includes(app))) {
				return Promise.resolve(true);
			}
		}

		// Create a folder and clone
		const pathToApp = `src/apps/${app}`;
		await createDir(join(path, pathToApp));

		if (!cd(path, pathToApp)) {
			return Promise.resolve(false);
		}

		const installedSuccessfully = appParts.reduce((ok, part) => {
			return ok ? clone(`app-${app}-${part}`, `${app}-${part}`) : false;
		}, true);

		installedSuccessfully
			? success(`Application "${app}" installed successfully.`)
			: error(`Failed to fully clone the application: "${app}". Installation stopped.`);

		return Promise.resolve(installedSuccessfully);
	}, Promise.resolve(true));
};

/**
 * Clone git repositories into their folders
 */
export const cloneRepositories = async (path, ...args) => {
	return cloneDocuments(path) && cloneCommon(path) && await cloneApps(path, ...args);
};
