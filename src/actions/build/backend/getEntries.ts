import {join} from 'node:path';
import {Fs, Validator} from '~/services';
import {CommanderOptionsTypes} from '~/utils';
import {config} from '~/config';
import {Entry} from './types';

const {apps} = config;

/**
 * Return all entry points for applications and common part
 */
export const getEntries = ({include, exclude}: CommanderOptionsTypes.IncludeExclude): Entry[] => {
	const cliApps = include ?? exclude ?? [];
	const {absoluteRootPath} = Fs;
	const entries: Entry[] = [];
	Validator.checkNonExistentApps(apps, cliApps);

	// Add common part
	const path = 'common/common-backend';
	entries.push({
		app: 'common',
		inputFile: join(absoluteRootPath, `${path}/src/index.ts`),
		distDir: join(absoluteRootPath, `${path}/dist`),
		tsConfigPath: join(absoluteRootPath, `${path}/tsconfig.json`),
	});

	// Add applications
	for (const app of apps) {
		if (Validator.skipApp(app, {include, exclude})) {
			continue;
		}

		const path = `apps/${app}/${app}-backend`;
		entries.push({
			app,
			inputFile: join(absoluteRootPath, `${path}/src/index.ts`),
			distDir: join(absoluteRootPath, `${path}/dist`),
			tsConfigPath: join(absoluteRootPath, `${path}/tsconfig.json`),
		});
	}

	return entries;
};
