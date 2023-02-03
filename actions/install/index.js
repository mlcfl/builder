import {argv} from 'process';
import {readdir} from 'fs/promises';
import {createStructure} from './createStructure.js';
import {cloneRepositories} from './cloneRepositories.js';
import {error, success, warning} from '../../utils/console.js';
import {absolutePathToApp} from '../../utils/absolutePathToApp.js';
import {config} from '../../utils/config.js';

const flagInclude = '--include';
const flagExclude = '--exclude';
const defaultArgvLength = 2;
const flagArgsCount = 2;
const {length} = argv;
const [, , flag, flagVal] = argv;

/**
 * Check files count in the root folder after installation
 */
const checkFilesCount = async () => {
	const maxFilesCount = [5, 6];// 6 if ".github" folder exists
	const {length} = await readdir(absolutePathToApp);

	if (!maxFilesCount.includes(length)) {
		warning(`Hmm, I expected ${maxFilesCount.join(' or ')} files in the root application folder, but you have ${length}. Why so, dear? 🙃`);
	}
};

/**
 * Installation process
 */
const install = async (apps, isFlagInclude) => {
	await createStructure(absolutePathToApp);
	const allCloned = await cloneRepositories(absolutePathToApp, apps, isFlagInclude);

	if (!allCloned) {
		return;
	}

	await checkFilesCount();
	success(`Application ${config.appName} was successfully installed. Use "npm run build" to build the application and then use "npm start" to run it.`);
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
		install();
		return;
	}

	if (!flagVal) {
		error('Parameter for the flag is missing.');
		return;
	}

	const apps = flagVal.split(',');

	// Include
	if (flag === flagInclude) {
		install(apps, true);
		return;
	}

	// Exclude
	if (flag === flagExclude) {
		install(apps, false);
		return;
	}

	error(`Only "${flagInclude}" or "${flagExclude}" are available.`);
})();
