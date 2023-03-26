import {join} from 'node:path';
import {Fs, Validator} from '~/services';
import {CommanderOptionsTypes} from '~/utils';
import {config} from '~/config';

const {apps} = config;

/**
 * Return all dist points for applications and common part
 * When frontend was changed, there is no need to restart nodemon.
 * That's why there are only common parts and backend in the paths.
 */
export const getWatchEntries = ({include, exclude}: CommanderOptionsTypes.IncludeExclude): string[] => {
	const {absoluteRootPath} = Fs;
	const entries: string[] = [];

	// Add common part
	entries.push(
		join(absoluteRootPath, 'common/common-backend/dist/*'),
		join(absoluteRootPath, 'common/common-all/dist/*'),
	);

	// Add applications
	for (const app of apps) {
		if (Validator.skipApp(app, {include, exclude})) {
			continue;
		}

		entries.push(
			join(absoluteRootPath, `apps/${app}/${app}-backend/dist/*`),
			join(absoluteRootPath, `apps/${app}/${app}-common/dist/*`),
		);
	}

	return entries;
};
