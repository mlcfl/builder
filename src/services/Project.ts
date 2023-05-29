import type {Base} from './Cli/Arguments';
import {Fs} from './Fs';
import {config} from '~/config';

type Cb<T> = (name: string, parts: string[]) => T;
type SkipArgs = {
	readonly include: string[] | undefined;
	readonly exclude: string[] | undefined;
};

/**
 * Cycles through different parts of the project
 */
export class Project {
	private static _ifExists = false;

	/**
	 * Skip callback if directory does not physically exist
	 *
	 * Work only for the next one call
	 */
	static get ifExists(): typeof Project {
		this._ifExists = true;
		return Project;
	}

	/**
	 * On "builder" directory
	 */
	static async onBuilder<T extends Base, U>(args: T, cb: (name: string) => U): Promise<U | void> {
		const name = 'builder';
		const {strict} = args;

		if (!strict || (strict && !this.skipApp(args, name))) {
			return await cb(name);
		}
	}

	/**
	 * On "documents" directory
	 */
	static async onDocuments<T extends Base, U>(args: T, cb: (name: string) => U): Promise<U | void> {
		const name = 'documents';
		const {strict} = args;
		const execute = !strict || (strict && !this.skipApp(args, name));

		if (await this.exists(`${name}/.git`) && execute) {
			return await cb(name);
		}
	}

	/**
	 * On "common" directory, on each its part
	 */
	static async onCommon<T extends Base, U>(args: T, cb: Cb<U>): Promise<U | void>
	static async onCommon<T extends Base, U>(args: T, filter: string[], cb: Cb<U>): Promise<U | void>
	static async onCommon<T extends Base, U>(args: T, filterOrCb: string[] | Cb<U>, cb?: Cb<U>): Promise<U | void> {
		const name = 'common';
		const {parts: {common}} = config;
		const {strict} = args;
		const isFunction = typeof filterOrCb === 'function';
		const filter = isFunction ? common : filterOrCb;
		const callback = isFunction ? filterOrCb : cb as Cb<U>;

		if (strict && this.skipApp(args, name)) {
			this._ifExists = false;
			return;
		}

		const filteredParts = await this.filterParts(
			common,
			part => `common/${name}-${part}`,
			part => filter.includes(part) && (strict ? !this.skipPart(args, part) : true),
		);

		if (filteredParts.length) {
			return await callback(name, filteredParts);
		}
	}

	/**
	 * On "apps" directory, on each application and its part
	 */
	static async onEachApp<T extends Base, U>(args: T, cb: Cb<U>): Promise<U[]>
	static async onEachApp<T extends Base, U>(args: T, filter: string[], cb: Cb<U>): Promise<U[]>
	static async onEachApp<T extends Base, U>(args: T, filterOrCb: string[] | Cb<U>, cb?: Cb<U>): Promise<U[]> {
		const {apps, parts} = config;
		const results: U[] = [];
		const isFunction = typeof filterOrCb === 'function';
		const filter = isFunction ? parts.app : filterOrCb;
		const callback = isFunction ? filterOrCb : cb as Cb<U>;
		const lastIndex = apps.length - 1;

		for (const [i, app] of Object.entries(apps)) {
			if (this.skipApp(args, app)) {
				continue;
			}

			const filteredParts = await this.filterParts(
				parts.app,
				part => `apps/${app}/${app}-${part}`,
				part => !this.skipPart(args, part) && filter.includes(part),
				Number(i) === lastIndex,
			);

			if (filteredParts.length) {
				results.push(await callback(app, filteredParts));
			}
		}

		this._ifExists = false;
		return results;
	}

	/**
	 * Skip application if it matches
	 */
	private static skipApp({include, exclude}: Base, app: string): boolean {
		return this.skip(app, {include, exclude});
	}

	/**
	 * Skip application part if it matches
	 */
	private static skipPart({includeParts, excludeParts}: Base, part: string): boolean {
		return this.skip(part, {
			include: includeParts,
			exclude: excludeParts,
		});
	}

	/**
	 * Skip application or application part
	 */
	private static skip(item: string, {include, exclude}: SkipArgs): boolean {
		if (include) {
			return !include.includes(item);
		}

		if (exclude) {
			return exclude.includes(item);
		}

		return false;
	}

	/**
	 * Filter parts
	 */
	private static async filterParts(
		parts: string[],
		pathTemplate: (part: string) => string,
		filterCb: (part: string) => boolean,
		changeFlag = true,
	): Promise<string[]> {
		const lastIndex = parts.length - 1;
		const result: string[] = [];

		for (const [i, part] of Object.entries(parts)) {
			const physicallyExists = await this.exists(pathTemplate(part), changeFlag && Number(i) === lastIndex);

			if (physicallyExists && filterCb(part)) {
				result.push(part);
			}
		}

		return result;
	}

	/**
	 * Check for physically existence
	 */
	private static async exists(path: string, changeFlag = true): Promise<boolean> {
		if (!this._ifExists) {
			return true;
		}

		if (changeFlag) {
			this._ifExists = false;
		}

		return await Fs.exists(Fs.absoluteRootPath, path);
	}
}
