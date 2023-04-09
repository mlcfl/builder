import {join} from 'node:path';
import {Fs, Project, CliArgs} from '~/services';

export type Entry = {
	readonly name: string,
	readonly part: string,
	readonly fullname: string,
	readonly inputFile: string,
	readonly distDir: string,
	readonly tsConfigPath: string,
};

/**
 * Common parts and boot entry point
 */
const getCommon = (args: CliArgs.Build) => Project.ifExists.onCommon(args, ['all', 'backend'], (common, parts) => {
	const {absoluteRootPath} = Fs;

	return parts.reduce<Entry[]>((acc, part) => {
		const name = `${common}-${part}`;
		const path = `common/${name}`;
		const distDir = join(absoluteRootPath, `${path}/dist`);
		const tsConfigPath = join(absoluteRootPath, `${path}/tsconfig.json`);

		acc.push({
			name: common,
			part,
			fullname: name,
			distDir,
			tsConfigPath,
			inputFile: join(absoluteRootPath, `${path}/src/index.ts`),
		});

		// Boot entry point
		if (part === 'backend') {
			acc.push({
				name: common,
				part: 'boot',
				fullname: 'common-boot',
				distDir,
				tsConfigPath,
				inputFile: join(absoluteRootPath, `${path}/src/boot.ts`),
			});
		}

		return acc;
	}, []);
});

/**
 * Applications
 */
const getApps = (args: CliArgs.Build) => Project.ifExists.onEachApp(args, ['common', 'backend'], (app, parts) => {
	const {absoluteRootPath} = Fs;

	return parts.reduce<Entry[]>((acc, part) => {
		const name = `${app}-${part}`;
		const path = `apps/${app}/${name}`;

		acc.push({
			name: app,
			part,
			fullname: name,
			inputFile: join(absoluteRootPath, `${path}/src/index.ts`),
			distDir: join(absoluteRootPath, `${path}/dist`),
			tsConfigPath: join(absoluteRootPath, `${path}/tsconfig.json`),
		});

		return acc;
	}, []);
});

/**
 * Return all entry points for applications and common part
 */
export const getEntries = async (args: CliArgs.Build): Promise<Entry[]> => {
	return [
		await getCommon(args),
		await getApps(args),
	]
	.flat(2)
	.filter(<T>(i: T | void): i is T => Boolean(i));
};
