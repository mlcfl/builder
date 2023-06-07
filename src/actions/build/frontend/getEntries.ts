import {join} from 'node:path';
import {Fs, Project, type CliArgs} from '~/services';

export type Entry = {
	readonly name: string,
	readonly part: string,
	readonly fullname: string,
	readonly rootDir: string,
	readonly distDir: string,
	readonly configPath: string,
	readonly tsConfigPath: string,
};

/**
 * Applications
 */
const getApps = (args: CliArgs.Build) => Project.ifExists.onEachApp(args, ['frontend'], (app, parts) => {
	const {absoluteRootPath} = Fs;

	return parts.reduce<Entry[]>((acc, part) => {
		const name = `${app}-${part}`;
		const path = `apps/${app}/${name}`;

		acc.push({
			name: app,
			part,
			fullname: name,
			rootDir: join(absoluteRootPath, path),
			distDir: join(absoluteRootPath, `${path}/dist`),
			configPath: join(absoluteRootPath, `${path}/app.config.json`),
			tsConfigPath: join(absoluteRootPath, `${path}/tsconfig.json`),
		});

		return acc;
	}, []);
});

/**
 * Return all entry points for applications part
 */
export const getEntries = async (args: CliArgs.Build): Promise<Entry[]> => {
	return (await getApps(args)).flat();
};
