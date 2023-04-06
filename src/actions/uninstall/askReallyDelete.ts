import {Interface} from 'node:readline/promises';
import {attention} from './attention';
import {answerToBoolean} from './answerToBoolean';
import {CliArgs} from '~/services';

/**
 * Really delete?
 */
export const askReallyDelete = async (readline: Interface, {reinstall}: CliArgs.Uninstall): Promise<boolean> => {
	if (reinstall) {
		return true;
	}

	const answer = await readline.question(`Are you sure you want to delete ${attention('the whole')} project? [Y/${attention('N')}] `);

	return answerToBoolean(answer);
};
