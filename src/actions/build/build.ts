import {CommanderOptionsTypes} from '../../utils';
import {backend} from './backend';

export const build = async (args: CommanderOptionsTypes.Build): Promise<void> => {
	await backend(args);
};
