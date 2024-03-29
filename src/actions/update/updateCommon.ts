import {Project, Git, Console, Pnpm, type CliArgs} from '~/services';

/**
 * Update common parts
 */
export const updateCommon = async (args: CliArgs.Update): Promise<void> => {
	await Project.ifExists.onCommon(args, async (name, parts) => {
		for (const part of parts) {
			Git.pull(`common/${name}-${part}`);
		}

		Console.info(`"git pull" on common parts "${parts.join(', ')}" executed successfully.`);
		await Pnpm.initCommon(name, parts);
	});
};
