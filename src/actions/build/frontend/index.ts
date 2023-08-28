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
	const parts: ReadyToBuildArgs[] = [];

	fe.emitter.on(Frontend.Events.ReadyToBuild, (args: ReadyToBuildArgs) => parts.push(args));

	await fe.prepare();

	for (const {app, entryName, entryConfig, type, viteConfig} of parts) {
		try {
			await build(viteConfig);

			if (type === 'ssg') {
				await fe.transformToSsg(app, entryConfig, entryName);
			}
		} catch (e) {
			Console.error(`Frontend ${type.toUpperCase()} build, application "${app.name}", entry "${entryName}"`, true);
			throw e;
		}
	}
};
