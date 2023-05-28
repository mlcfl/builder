import {defineConfig, RollupOptions} from 'rollup';
import {CliArgs} from '~/services';
import {getEntries, Entry} from './getEntries';
import {external} from './external';
import {watch} from './watch';
import {
	pluginAliases,
	pluginJson,
	pluginNodeResolve,
	pluginCommonJs,
	pluginTypescript,
} from './plugins';

/**
 * Rollup configuration for each entry file
 */
export const getConfigs = async (args: CliArgs.Build): Promise<RollupOptions[]> => {
	const {mode} = args;
	const entries = await getEntries(args);
	const getConfig = (entry: Entry): RollupOptions => {
		const {
			inputFile,
			distDir,
			tsConfigPath,
		} = entry;

		return defineConfig({
			input: inputFile,
			output: {
				dir: distDir,
				format: 'esm',
				preserveModules: true,
			},
			plugins: [
				pluginAliases(),
				pluginJson(),
				pluginNodeResolve(),
				pluginCommonJs(),
				pluginTypescript(tsConfigPath),
			],
			external: external(entry),
			watch,
		});
	};

	return entries.map(getConfig);
};
