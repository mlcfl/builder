import {rollup, watch, RollupOptions, RollupWatcher, RollupWatcherEvent} from 'rollup';
import chalk from 'chalk';
import {Console, Fs} from '~/services';
import {CommanderOptionsTypes} from '~/utils';
import {getConfigs} from './getConfigs';
import {handleError} from './handleError';

/**
 * Just build
 */
const build = async (configs: RollupOptions[]): Promise<void> => {
	Console.info('Starting backend building...');

	for (const {output, ...input} of configs) {
		if (!output || Array.isArray(output)) {
			Console.warning(`Invalid "output" field in the backend configuration. Must be "[object Object]", but ${Object.prototype.toString.call(output)} found.`);
			continue;
		}

		try {
			const bundle = await rollup(input);
			await bundle.write(output);
			await bundle.close();
		} catch (e) {
			handleError(e);
		}
	}

	Console.success('Backend building successfully completed.');
};

/**
 * Build in "watch" mode
 */
const buildWatch = (configs: RollupOptions[]): RollupWatcher => {
	Console.info('Starting backend building in "watch" mode...');

	let alreadyShown: unknown[] = [];
	let firstBuild = true;
	const onEvent = (e: RollupWatcherEvent) => {
		const {code} = e;

		if (code === 'END') {
			alreadyShown = [];
			firstBuild = false;
			return;
		}

		if (code === 'ERROR') {
			alreadyShown = handleError(e.error, {alreadyShown, firstBuild});
			return;
		}

		if (code === 'BUNDLE_END') {
			if (!firstBuild) {
				Console.success(`Rebuilt in ${e.duration}ms`);
			}

			// This will allow plugins to clean up resources
			e.result.close();
		}
	};

	return watch(configs)
		.on('event', onEvent)
		.on('restart', () => console.log('Backend: restarting build...'))
		.on('close', () => Console.warning('Backend: the watcher was closed for some reason.'))
		.on('change', (id, {event}) => {
			const file = chalk.blueBright(id.slice(Fs.absoluteRootPath.length));
			console.log(`Backend: "${file}" was ${event}d.`);
		});
};

/**
 * Build backend
 */
export const backend = async (args: CommanderOptionsTypes.Build): Promise<void | RollupWatcher> => {
	const configs = getConfigs(args);

	return args.watch
		? buildWatch(configs)
		: await build(configs);
};
