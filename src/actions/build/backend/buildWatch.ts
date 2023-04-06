import {
	watch,
	RollupOptions,
	RollupWatcher,
	RollupWatcherEvent,
	ChangeEvent,
	RollupError,
} from 'rollup';
import chalk from 'chalk';
import {Fs, Console} from '~/services';
import {handleError, Options} from './handleError';

const onRestart = () => console.log('Backend: restarting build...');
const onClose = () => Console.warning('Backend: the watcher was closed for some reason.');

// On file change
const onChange = (id: string, {event}: {event: ChangeEvent}): void => {
	const file = chalk.blueBright(id.slice(Fs.absoluteRootPath.length));
	console.log(`Backend: "${file}" was ${event}d.`);
};

// On each bundle event
const onEvent = (options: Options<RollupError | string>, e: RollupWatcherEvent): void => {
	const {code} = e;

	switch (code) {
		case 'END':
			options.alreadyShown = [];
			options.firstBuild = false;
			break;
		case 'ERROR':
			options.alreadyShown = handleError(e.error, options);
			break;
		case 'BUNDLE_END':
			if (!options.firstBuild) {
				Console.success(`Rebuilt in ${e.duration}ms`);
			}

			// This will allow plugins to clean up resources
			e.result.close();
			break;
	}
};

/**
 * Build in "watch" mode
 */
export const buildWatch = (configs: RollupOptions[]): RollupWatcher => {
	Console.info('Starting backend building in "watch" mode...');

	const options: Options<never> = {
		alreadyShown: [],
		firstBuild: true,
	};

	const watcher = watch(configs)
		.on('event', onEvent.bind(null, options))
		.on('restart', onRestart)
		.on('close', onClose)
		.on('change', onChange);

	return watcher;
};
