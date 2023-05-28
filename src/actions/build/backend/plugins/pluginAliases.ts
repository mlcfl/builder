import alias, {RollupAliasOptions} from '@rollup/plugin-alias';

const entries: RollupAliasOptions['entries'] = [
	/**
	 * Common all
	 */
	// Directory
	{
		find: /^common\/all\/(.*)(?<!\.[a-z]*)$/,
		replacement: 'common-all/dist/$1/index.js',
	},
	// File
	{
		find: /^common\/all\/(.*\.[a-z]*)$/,
		replacement: 'common-all/dist/$1',
	},
	/**
	 * Common backend
	 */
	// Directory
	{
		find: /^common\/be\/(.*)(?<!\.[a-z]*)$/,
		replacement: 'common-be/dist/$1/index.js',
	},
	// File
	{
		find: /^common\/be\/(.*\.[a-z]*)$/,
		replacement: 'common-be/dist/$1',
	},
	/**
	 * Common frontend
	 */
	// Directory
	{
		find: /^common\/fe\/(.*)(?<!\.[a-z]*)$/,
		replacement: 'common-fe/dist/$1/index.js',
	},
	// File
	{
		find: /^common\/fe\/(.*\.[a-z]*)$/,
		replacement: 'common-fe/dist/$1',
	},
	/**
	 * Common
	 */
	// Directory
	{
		find: /^common\/(?!(?:all|be|fe)\/)(.*)(?<!\.[a-z]*)$/,
		replacement: 'common/dist/$1/index.js',
	},
	// File
	{
		find: /^common\/(?!(?:all|be|fe)\/)(.*\.[a-z]*)$/,
		replacement: 'common/dist/$1',
	},
];

/**
 * Aliases for rollup
 */
export const pluginAliases = () => alias({entries});
