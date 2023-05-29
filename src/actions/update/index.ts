import {updateBuilder} from './updateBuilder';
import {updateDocuments} from './updateDocuments';
import {updateCommon} from './updateCommon';
import {updateApps} from './updateApps';
import {Console, type CliArgs} from '~/services';
import {config} from '~/config';

/**
 * Update process
 */
export const update = async (args: CliArgs.Update): Promise<void> => {
	await updateBuilder(args);
	await updateDocuments(args);
	await updateCommon(args);
	await updateApps(args);

	Console.success(`Project ${config.projectName} was successfully updated. Use the "build" command to build the project and then use the "start" command to run it.`);
};
