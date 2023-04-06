import {RollupWatcher} from 'rollup';
import {backend} from './backend';
import {CliArgs} from '~/services';

type BuildResult = {
	readonly watcherBackend: void | RollupWatcher;
	readonly watcherFrontend: void | unknown;
};

/**
 * Build process
 */
export const build = async (args: CliArgs.Build): Promise<BuildResult> => ({
	watcherBackend: await backend(args),
	watcherFrontend: null,
});
