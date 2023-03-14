import {stdin, stdout} from 'node:process';
import {createInterface} from 'node:readline/promises';
import chalk from 'chalk';

const attention = (text: string): string => chalk.bold.underline(text);
const answerToBoolean = (answer: string): boolean => /^(?:y|yes)$/i.test(answer);

/**
 * Readline interface
 */
export const readline = createInterface({input: stdin, output: stdout});

/**
 * Really delete?
 */
export const askReallyDelete = async (reinstall?: boolean): Promise<boolean> => {
	if (reinstall) {
		return true;
	}

	const answer = await readline.question(`Are you sure you want to delete ${attention('the whole')} project? [Y/${attention('N')}] `);
	return answerToBoolean(answer);
};

/**
 * Delete personal data?
 */
export const askDeletePersonal = async (reinstall?: boolean): Promise<boolean> => {
	if (reinstall) {
		return false;
	}

	const answer = await readline.question(`Do you want to delete ${attention('your personal data')}? [Y/${attention('N')}] `);
	return answerToBoolean(answer);
};
