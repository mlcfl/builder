import {Entry} from './getEntries';

/**
 * Field "external" for rollup
 */
export const external = ({name, fullname}: Entry): RegExp[] => {
	// Get application name if exists
	const app = name === 'common' ? '' : name;

	// Allowed modules for different parts
	const regexps: RegExp[] = {
		'common-all': [],
		'common-backend': [/common-all/],
		'common-boot': [/common-all/],
		'common-frontend': [/common-all/],
		[`${app}-common`]: [/common-all/],
		[`${app}-backend`]: [/common-all/, /common-backend/, new RegExp(`${name}-common`)],
		[`${app}-frontend`]: [/common-all/, /common-frontend/, new RegExp(`${name}-common`)],
	}[fullname] ?? [];

	// Result entries
	const entries = [
		// For the backend, there is no need to include node_modules
		/node_modules/,
		/**
		 * For imports like "import X from 'common-all'".
		 * This prevents the common/* parts from being included in the application's "dist" directory.
		 * However, the module cannot be external if it is an entry point.
		 */
		...regexps,
	];

	return entries.filter(<T>(i: T | false): i is T => Boolean(i));
};
