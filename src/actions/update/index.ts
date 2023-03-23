import {Git, Console, Validator} from '../../services';
import {CommanderOptionsTypes} from '../../utils';
import {config} from '../../config';

const {parts, apps} = config;

/**
 * Update builder
 */
export const pullBuilder = (): void => {
	Git.pull('builder');
	Console.success('Builder updated successfully.');
};

/**
 * Update documents
 */
export const pullDocuments = (): void => {
	Git.pull('documents');
	Console.success('Documents updated successfully.');
};

/**
 * Update common parts
 */
export const pullCommon = (): void => {
	parts.common.forEach((part) => {
		Git.pull(`common/common-${part}`);
	});
	Console.success('Common parts updated successfully.');
};

/**
 * Update applications
 */
export const pullApps = ({include, exclude}: CommanderOptionsTypes.IncludeExclude): void => {
	const cliApps = include ?? exclude ?? [];
	Validator.checkNonExistentApps(apps, cliApps);

	for (const app of apps) {
		if (Validator.skipApp(app, {include, exclude})) {
			continue;
		}

		// Update all parts
		try {
			parts.app.forEach((part) => {
				Git.pull(`apps/${app}/${app}-${part}`);
			});
			Console.success(`Application "${app}" updated successfully.`);
		} catch (e) {
			Console.error(`Failed to fully update the application: "${app}". Action stopped.`);
		}
	}
};
