import {Project, Git, Console, Pnpm, CliArgs} from '~/services';

/**
 * Update applications
 */
export const updateApps = async (args: CliArgs.Update): Promise<void> => {
	await Project.ifExists.onEachApp(args, async (app, parts) => {
		try {
			for (const part of parts) {
				Git.pull(`apps/${app}/${app}-${part}`);
			}

			Console.info(`"git pull" on the application "${app}" (${parts.join(', ')}) executed successfully.`);
			await Pnpm.initApp(app, parts);
		} catch (e) {
			Console.error(`Failed to update the application: "${app}". Action stopped.`);
		}
	});
};
