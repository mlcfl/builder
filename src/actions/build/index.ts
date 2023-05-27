import type {RollupWatcher} from 'rollup';
import type {ViteDevServer} from 'vite';
import {backend} from './backend';
import {frontend} from './frontend';
import type {CliArgs} from '~/services';

// Return void if build mode, return watchers if watch mode
type BuildResult = {
	readonly watcherBackend: void | RollupWatcher;
	readonly watcherFrontend: void | ViteDevServer;
};

/**
 * Build process
 */
export const build = async (args: CliArgs.Build): Promise<BuildResult> => ({
	watcherBackend: await backend(args),
	watcherFrontend: await frontend(args),
});
