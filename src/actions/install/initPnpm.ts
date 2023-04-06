import {Project, Pnpm, CliArgs} from '~/services';

/**
 * Run "pnpm install" and then "pnpm link" for common/* aliases
 */
export const initPnpm = async (args: CliArgs.Install): Promise<void> => {
	await Project.onCommon(args, Pnpm.initCommon.bind(Pnpm));
	await Project.onEachApp(args, Pnpm.initApp.bind(Pnpm));
};
