/**
 * Import the config file from ".json"
 * Why so? To discourage the use of complex types in ".js" -> used ".json" config file
 */
import json from './config.json';

type AppOptions = {
	readonly auth: boolean;
	readonly parts: string[];
};

type Config = {
	readonly projectName: string;
	readonly projectRootDirName: string;
	readonly remoteRepositoryUri: string;
	readonly defaultApp: string;
	readonly apps: (string | [string, AppOptions])[];
	readonly parts: {
		readonly common: string[];
		readonly app: string[];
	};
};

export const config = Object.freeze(json) as Config;
