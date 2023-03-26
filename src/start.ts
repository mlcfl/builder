import {exit, argv} from 'node:process';
import {join} from 'node:path';
import {RollupWatcher, RollupWatcherEvent} from 'rollup';
import nodemon from 'nodemon';
import chalk from 'chalk';
import {Fs, Console, ModeOptions} from './services';
import {handleCliArgs} from './actions/start/handleCliArgs';// special import
import {getWatchEntries} from './actions/start/getWatchEntries';

/**
 * Entry
 */
const args = handleCliArgs();
const indexPath = 'builder/dist/actions/start/index.js';
const {mode, watch} = args;

// watch is true only in the dev mode
if (watch) {
	const {watcherBackend} = await import('./build') as {watcherBackend: RollupWatcher};
	// Start nodemon after the first "watch" build was completed
	const startNodemon = ({code}: RollupWatcherEvent) => {
		if (code !== 'END') {
			return;
		}

		watcherBackend.off('event', startNodemon);

		nodemon({
			script: join(Fs.absoluteRootPath, indexPath),
			watch: getWatchEntries(args),
			args: argv.slice(2),
			delay: 1000,
		});

		nodemon
			.on('restart', () => Console.info('Backend has been restarted.'))
			.once('start', () => Console.info('The project has been started in "watch" mode.'))
			.once('crash', () => {
				console.error(chalk.red('Backend has been crashed.'));
				nodemon.emit('quit');
				exit(1);
			});
	};

	watcherBackend.on('event', startNodemon);
} else {
	if (mode === ModeOptions.Dev) {
		await import('./build');
	}

	Console.info('The project has been started.');
	await import(join(Fs.absoluteRootPathDi, indexPath));
}
