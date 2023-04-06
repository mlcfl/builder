import json from '@rollup/plugin-json';

/**
 * Resolve .json imports
 */
export const pluginJson = () => json({
	preferConst: true,
	namedExports: false,
});
