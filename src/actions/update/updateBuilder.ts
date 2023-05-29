import {Project, Git, Console, type CliArgs} from '~/services';

/**
 * Update builder
 */
export const updateBuilder = async (args: CliArgs.Update): Promise<void> => {
	await Project.onBuilder(args, (name) => {
		Git.pull(name);
		Console.info('"git pull" on the builder executed successfully.');
	});
};
