import {RollupWatcher} from 'rollup';
import {CliArgs} from '~/services';
import {getConfigs} from './getConfigs';
import {build} from './build';
import {buildWatch} from './buildWatch';

/**
 * Build backend
 */
export const backend = async (args: CliArgs.Build): Promise<void | RollupWatcher> => {
	const configs = await getConfigs(args);

	return args.watch
		? buildWatch(configs)
		: await build(configs);
};
