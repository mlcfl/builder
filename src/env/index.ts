import {fileURLToPath} from 'node:url';
import {join, dirname} from 'node:path';
import dotenv from 'dotenv';
import {ModeOptions} from '../services';
import {Env} from './types';

let config: Env;

/**
 * Return env config file
 */
export const env = (mode: ModeOptions): Env => {
	if (!config) {
		const pathToThis = dirname(fileURLToPath(import.meta.url));
		const path = join(pathToThis, `.env.${mode}`);
		const {parsed, error} = dotenv.config({path});

		if (error) {
			throw error;
		}

		config = Object.freeze(parsed as unknown as Env);
	}

	return config;
};
