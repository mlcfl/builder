import {exit, argv} from 'node:process';
import {join} from 'node:path';
import {RollupWatcherEvent} from 'rollup';
import nodemon from 'nodemon';
import {Fs, Console, CliArgs} from '~/services';
import {build} from '../build';
import {getWatchEntries} from './getWatchEntries';

/**
 * Start nodemon
 */
const startNodemon = async (args: CliArgs.Start): Promise<void> => {
	const script = join(Fs.absoluteRootPath, 'builder/dist/actions/start/nodemonMiddleware.js');
	const watch = await getWatchEntries(args);

	nodemon({
		script,
		watch,
		args: argv.slice(2),
		delay: 1000,
	});

	nodemon
		.on('restart', () => Console.info('Backend has been restarted.'))
		.once('start', () => Console.info('The project has been started in "watch" mode.'))
		.once('crash', () => {
			Console.error('Backend has been crashed.', true);
			nodemon.emit('quit');
			exit(1);
		});
};

/**
 * Start in "watch" mode
 */
export const runWatch = async (args: CliArgs.Start): Promise<void> => {
	const {watcherBackend: watcher} = await build(args);

	if (!watcher) {
		Console.error('Something went wrong while building the project. Watcher object for backend not found.');
	}

	// Start nodemon after the first "watch" build was completed
	const onEvent = ({code}: RollupWatcherEvent): void => {
		if (code !== 'END') {
			return;
		}

		watcher.off('event', onEvent);
		startNodemon(args);
	};

	watcher.on('event', onEvent);
};
