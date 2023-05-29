import {Fs, Git, Console, Project, type CliArgs} from '~/services';

const {absoluteRootPath} = Fs;

/**
 * Clone "documents" repository
 */
const cloneDocuments = async (args: CliArgs.Install): Promise<void> => {
	await Project.onDocuments(args, (name) => {
		Fs.cd(absoluteRootPath);
		Git.clone(Git.getUri(name));
		Console.success('Documents cloned successfully.');
	});
};

/**
 * Clone "common" repositories
 */
const cloneCommon = async (args: CliArgs.Install): Promise<void> => {
	await Project.onCommon(args, (name, parts) => {
		Fs.cd(absoluteRootPath, name);

		for (const part of parts) {
			Git.clone(Git.getUri(`${name}-${part}`));
		}

		Console.success(`Common "${parts.join(', ')}" cloned successfully.`);
	});
};

/**
 * Clone apps repositories
 */
const cloneApps = async (args: CliArgs.Install): Promise<void> => {
	await Project.onEachApp(args, async (app, parts) => {
		// Create a directory
		const pathToApp = `apps/${app}`;
		await Fs.createDir(absoluteRootPath, pathToApp);
		Fs.cd(absoluteRootPath, pathToApp);

		// Clone parts
		try {
			for (const part of parts) {
				Git.clone(Git.getUri(`app-${app}-${part}`), `${app}-${part}`);
			}

			Console.success(`Application "${app}" (${parts.join(', ')}) cloned successfully.`);
		} catch (e) {
			Console.error(`Failed to clone the application: "${app}". Installation stopped.`);
		}
	});
};

/**
 * Clone git repositories into their directories
 */
export const cloneRepositories = async (args: CliArgs.Install): Promise<void> => {
	await cloneDocuments(args);
	await cloneCommon(args);
	await cloneApps(args);
};
