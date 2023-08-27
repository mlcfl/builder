import {join} from 'node:path';
import shell from 'shelljs';
import {Fs} from './Fs';
import {Console} from './Console';

type InitArgs = {
	readonly name: string;
	readonly parts: string[];
	readonly dirs: Record<string, string[]>;
	readonly isCommon: boolean;
};

/**
 * Work with pnpm
 */
export class Pnpm {
	/**
	 * Common parts
	 */
	static async initCommon(name: string, parts: string[]): Promise<void> {
		const dirs = {
			all: [],
			backend: ['../common-all'],
			frontend: ['../common-all'],
		};

		const installed = await this.init({name, parts, dirs, isCommon: true});

		if (installed.length) {
			Console.info(`Dependencies were installed for common parts: ${installed.join(', ')}.`);
		}
	}

	/**
	 * Applications
	 */
	static async initApp(name: string, parts: string[]): Promise<void> {
		const path = '../../../common';
		const dirs = {
			common: [`${path}/common-all`],
			backend: [
				`${path}/common-all`,
				`${path}/common-backend`,
				`../${name}-common`,
			],
			frontend: [
				`${path}/common-all`,
				`${path}/common-backend`,// for SSR & SSG only (SsrRenderer import)
				`${path}/common-frontend`,
				`../${name}-common`,
			],
		};

		const installed = await this.init({name, parts, dirs, isCommon: false});

		if (installed.length) {
			Console.info(`Dependencies were installed for the application "${name}" (${installed.join(', ')}).`);
		}
	}

	/**
	 * Init: install & link
	 */
	private static async init({name, parts, dirs, isCommon}: InitArgs): Promise<string[]> {
		const keys = Object.keys(dirs);
		const rootPath = Fs.absoluteRootPath;
		const result: string[] = [];

		for (const part of parts) {
			if (!keys.includes(part)) {
				continue;
			}

			const path = isCommon ? `common/${name}-${part}` : `apps/${name}/${name}-${part}`;
			const pathAbsolute = join(rootPath, path);
			const isPackageJson = await Fs.exists(pathAbsolute, 'package.json');
			const isLockFile = await Fs.exists(pathAbsolute, 'pnpm-lock.yaml');

			if (!isPackageJson && !isLockFile) {
				Console.warning(`There is no "package.json" and "pnpm-lock.yaml" file for "${path}". Dependency installation skipped.`);
				continue;
			}

			result.push(part);
			Fs.cd(rootPath, path);

			// Install dependencies
			if (isLockFile) {
				this.install(path);
			}

			// Linking
			if (isPackageJson) {
				for (const link of dirs[part]) {
					const linkedPackageJson = join(pathAbsolute, link, '/package.json');

					if (await Fs.exists(linkedPackageJson)) {
						this.link(path, link);
					}
				}
			}
		}

		return result;
	}

	/**
	 * pnpm install
	 */
	private static install(path: string): void {
		const {code} = shell.exec('pnpm install --frozen-lockfile');
		const success = code === 0;

		if (!success) {
			Console.error(`Something went wrong while installing dependencies for "${path}". Action stopped.`);
		}
	}

	/**
	 * pnpm link
	 *
	 * Note:
	 * When linking a part to an alias, if that alias doesn't have pnpm-lock.yaml, it will be created
	 */
	private static link(path: string, pathToAlias: string): void {
		const {code} = shell.exec(`pnpm link ${pathToAlias}`);
		const success = code === 0;

		if (!success) {
			Console.error(`Something went wrong while linking aliases for "${path}". Action stopped.`);
		}
	}
}
