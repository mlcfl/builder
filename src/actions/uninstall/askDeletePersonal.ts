import {Interface} from 'node:readline/promises';
import {attention} from './attention';
import {answerToBoolean} from './answerToBoolean';
import {CliArgs} from '~/services';

/**
 * Delete personal data?
 */
export const askDeletePersonal = async (readline: Interface, {reinstall}: CliArgs.Uninstall): Promise<boolean> => {
	if (reinstall) {
		return false;
	}

	const answer = await readline.question(`Do you want to delete ${attention('your personal data')}? [Y/${attention('N')}] `);

	return answerToBoolean(answer);
};
