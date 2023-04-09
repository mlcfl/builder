import {Project, Git, Console, CliArgs} from '~/services';

/**
 * Update documents
 */
export const updateDocuments = async (args: CliArgs.Update): Promise<void> => {
	await Project.ifExists.onDocuments(args, (name) => {
		Git.pull(name);
		Console.info('"git pull" on the documents executed successfully.');
	});
};
