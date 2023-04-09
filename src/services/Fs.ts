import {mkdir, access} from 'node:fs/promises';
import {constants, readdirSync, statSync} from 'node:fs';
import {cwd} from 'node:process';
import {join, extname} from 'node:path';
import shell from 'shelljs';
import {Console} from './Console';

type TreeItem = string | Record<string, TreeItem[]>;
type Tree = TreeItem[];

/**
 * Work with file system
 */
export class Fs {
	private static _absoluteRootPath = join(cwd(), '..');
	private static _absoluteRootPathDi = join(import.meta.url, '../../../..');

	/**
	 * Absolute path to the project
	 */
	static get absoluteRootPath(): string {
		return this._absoluteRootPath;
	}

	/**
	 * Absolute path to the project for dynamic imports (with the "file://" schema)
	 */
	static get absoluteRootPathDi(): string {
		return this._absoluteRootPathDi;
	}

	/**
	 * Check existence (directory or file)
	 */
	static async exists(...paths: string[]): Promise<boolean> {
		const path = join(...paths);

		try {
			await access(path, constants.F_OK);
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Create a new directory
	 */
	static async createDir(...paths: string[]): Promise<void> {
		const path = join(...paths);

		await this.exists(path)
			// If exists, send warning
			? Console.warning(`Directory "${path}" already exists. Nothing bad, but it would be nice to check its permissions.`)
			// Doesn't exist, create
			: await mkdir(path);
	}

	/**
	 * Go to directory
	 */
	static cd(...paths: string[]): void {
		const path = join(...paths);
		const {code} = shell.cd(path);
		const success = code === 0;

		if (!success) {
			Console.error(`Something went wrong with go to "${path}" path. Probably it doesn't exist or you don't have enough permissions.`);
		}
	}

	/**
	 * Creating a directory tree structure
	 */
	static async createTree(path: string, structure: Tree): Promise<void> {
		for (const dir of structure) {
			if (typeof dir === 'string') {
				await this.createDir(path, dir);
				continue;
			}

			for (const [key, val] of Object.entries(dir)) {
				const newPath = join(path, key);
				await this.createDir(path, key);
				await this.createTree(newPath, val);
			}
		}
	}

	/**
	 * Return all entry points for builder actions
	 */
	static getActionsEntryPoints(): string[] {
		const pathToSrc = join(this.absoluteRootPath, 'builder/src');

		const entryPoints = readdirSync(pathToSrc).reduce<string[]>((result, item) => {
			const path = join(pathToSrc, item);
			const stats = statSync(path);

			if (stats.isFile() && extname(path) === '.ts') {
				result.push(path);
			}

			return result;
		}, []);

		// An additional independent entry point for backend nodemon
		entryPoints.push(join(pathToSrc, 'actions/start/nodemonMiddleware.ts'));

		return entryPoints;
	}
}
