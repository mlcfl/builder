import type {ViteDevServer} from 'vite';
import {Console, type CliArgs} from '~/services';
import {build} from './build';
import {buildWatch} from './buildWatch';
import {Frontend} from './Frontend';
import {ReadyToBuildArgs} from './types';

/**
 * Build frontend
 */
export const frontend = async (args: CliArgs.Build): Promise<void | ViteDevServer[]> => {
	const fe = new Frontend(args);

	fe.emitter.on(Frontend.Events.ReadyToBuild, async ({app, entryName, entryConfig, type, viteConfig}: ReadyToBuildArgs) => {
		try {
			await build(viteConfig);

			if (type === 'ssg') {
				await fe.transformToSsg(app, entryConfig, entryName);
			}
		} catch (e) {
			Console.error(`Frontend ${type.toUpperCase()} build, application "${app.name}", entry "${entryName}"`, true);
			throw e;
		}
	});

	await fe.prepare();
};
