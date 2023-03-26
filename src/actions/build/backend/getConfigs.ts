import {defineConfig, RollupOptions} from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import json, {RollupJsonOptions} from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import {CommanderOptionsTypes} from '~/utils';
import {getEntries} from './getEntries';

const pluginJsonConfig: RollupJsonOptions = {
	preferConst: true,
	namedExports: false,
};

export const getConfigs = ({mode, ...cliApps}: CommanderOptionsTypes.Build): RollupOptions[] => {
	const entries = getEntries(cliApps);

	return entries.map(({inputFile, distDir, tsConfigPath}) => {
		return defineConfig({
			input: inputFile,
			output: {
				dir: distDir,
				format: 'esm',
				preserveModules: true,
			},
			plugins: [
				json(pluginJsonConfig),
				nodeResolve(),
				commonjs(),
				typescript({
					tsconfig: tsConfigPath,
				}),
			],
			external: [
				/node_modules/,
			],
			watch: {
				buildDelay: 1000,
				exclude: 'node_modules/**',
			},
		});
	});
};
