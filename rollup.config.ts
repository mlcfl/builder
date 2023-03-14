import {join} from 'node:path';
import {defineConfig} from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import json, {RollupJsonOptions} from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import copy, {CopyOptions} from 'rollup-plugin-copy';
// Important: do not import just from './src/services', because .json imports are not recognized by rollup
import {Fs} from './src/services/Fs';

const pluginJsonConfig: RollupJsonOptions = {
	preferConst: true,
	namedExports: false,
};

const pluginCopyConfig: CopyOptions = {
	targets: [
		{
			src: [
				'src/env/.env.dev',
				'src/env/.env.test',
				'src/env/.env.prod',
			],
			dest: 'dist/env',
		},
	],
};

export default defineConfig({
	input: Fs.getActionsEntryPoints(),
	output: {
		dir: join(Fs.absoluteRootPath, 'builder/dist'),
		format: 'esm',
		preserveModules: true,
	},
	plugins: [
		json(pluginJsonConfig),
		nodeResolve(),
		commonjs(),
		typescript(),
		copy(pluginCopyConfig),
	],
	external: [
		/node_modules/,
	],
});
