import {WatcherOptions} from 'rollup';

/**
 * Field "watch" for rollup
 */
export const watch: WatcherOptions = {
	buildDelay: 1000,
	exclude: 'node_modules/**',
};
