import {Fs, Git, Console, Validator} from '../../services';
import {CommanderOptionsTypes} from '../../utils';
import {config} from '../../config';

const {apps, parts} = config;
const {absoluteRootPath} = Fs;

/**
 * Clone "documents" repository
 */
const cloneDocuments = (): void => {
	Fs.cd(absoluteRootPath);
	Git.clone(Git.getUri('documents'));
	Console.success('Documents cloned successfully.');
};

/**
 * Clone "common" repositories
 */
const cloneCommon = (): void => {
	Fs.cd(absoluteRootPath, 'common');
	parts.common.forEach((part) => {
		Git.clone(Git.getUri(`common-${part}`));
	});
	Console.success('Common parts cloned successfully.');
};

/**
 * Clone apps repositories
 */
const cloneApps = async ({include, exclude}: CommanderOptionsTypes.IncludeExclude): Promise<void> => {
	// To avoid duplicates, e.g. in the "reinstall" action
	const cliApps = [...new Set(include ?? exclude ?? [])];
	Validator.checkNonExistentApps(apps, cliApps);

	for (const app of apps) {
		// Skip app if it matches
		if (cliApps.length) {
			if ((include && !cliApps.includes(app)) || (exclude && cliApps.includes(app))) {
				continue;
			}
		}

		// Create a directory
		const pathToApp = `apps/${app}`;
		await Fs.createDir(absoluteRootPath, pathToApp);
		Fs.cd(absoluteRootPath, pathToApp);

		// Clone all parts
		try {
			parts.app.forEach((part) => {
				Git.clone(Git.getUri(`app-${app}-${part}`), `${app}-${part}`);
			});
			Console.success(`Application "${app}" cloned successfully.`);
		} catch (e) {
			Console.error(`Failed to fully clone the application: "${app}". Installation stopped.`);
		}
	}
};

/**
 * Clone git repositories into their directories
 */
export const cloneRepositories = async (apps: CommanderOptionsTypes.IncludeExclude): Promise<void> => {
	cloneDocuments();
	cloneCommon();
	await cloneApps(apps);
};
