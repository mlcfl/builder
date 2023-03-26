import {RollupWatcher} from 'rollup';
import {CommanderOptionsTypes} from '~/utils';
import {backend} from './backend';

export const build = async (args: CommanderOptionsTypes.Build): Promise<{watcherBackend: void | RollupWatcher}> => {
	const watcherBackend = await backend(args);

	return {
		watcherBackend,
	};
};
