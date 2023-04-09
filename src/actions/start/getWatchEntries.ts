import {join} from 'node:path';
import {Project, Fs, CliArgs} from '~/services';

/**
 * Return all dist points for applications and common part
 * When frontend was changed, there is no need to restart nodemon.
 * That's why there are only common parts and backend in the paths.
 */
export const getWatchEntries = async (args: CliArgs.Start): Promise<string[]> => {
	const {absoluteRootPath} = Fs;
	const entries: string[] = [];

	// Add common part
	await Project.ifExists.onCommon(args, ['all', 'backend'], (common, parts) => {
		for (const part of parts) {
			const path = join(absoluteRootPath, `common/${common}-${part}/dist/*`);
			entries.push(path);
		}
	});

	// Add applications
	await Project.ifExists.onEachApp(args, ['common', 'backend'], (app, parts) => {
		for (const part of parts) {
			const path = join(absoluteRootPath, `apps/${app}/${app}-${part}/dist/*`);
			entries.push(path);
		}
	});

	return entries;
};
