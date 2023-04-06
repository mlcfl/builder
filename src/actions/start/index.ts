import {CliArgs} from '~/services';
import {run} from './run';
import {runWatch} from './runWatch';

/**
 * Start
 */
export const start = async (args: CliArgs.Start): Promise<void> => {
	// Is true only in the dev mode
	args.watch
		? await runWatch(args)
		: await run(args);
};
