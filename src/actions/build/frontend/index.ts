import type {ViteDevServer} from 'vite';
import type {CliArgs} from '~/services';
import {getConfigs} from './getConfigs';
import {build} from './build';
import {buildWatch} from './buildWatch';

/**
 * Build frontend
 */
export const frontend = async (args: CliArgs.Build): Promise<void | ViteDevServer[]> => {
	const configs = await getConfigs(args);

	return args.watch
		? await buildWatch(configs)
		: await build(configs);
};
