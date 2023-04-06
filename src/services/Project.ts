import {Base} from './Cli/Arguments';
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

		if (!strict || (strict && !this.skipApp(args, name))) {
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

		if (!strict) {
			const filteredParts = common.filter(part => filter.includes(part));

			return await callback(name, filteredParts);
		} else if (!this.skipApp(args, name)) {
			const filteredParts = common.filter(part => !this.skipPart(args, part) && filter.includes(part));

			if (filteredParts.length) {
				return await callback(name, filteredParts);
			}
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

		for (const app of apps) {
			if (this.skipApp(args, app)) {
				continue;
			}

			const filteredParts = parts.app.filter(part => !this.skipPart(args, part) && filter.includes(part));

			if (filteredParts.length) {
				results.push(await callback(app, filteredParts));
			}
		}

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
}
