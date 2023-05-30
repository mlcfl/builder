import {defineConfig, type InlineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {CliModes, type CliArgs} from '~/services';
import {getEntries, type Entry} from './getEntries';

/**
 * Vite configuration for each entry file
 */
export const getConfigs = async (args: CliArgs.Build): Promise<InlineConfig[]> => {
	const mode = args.mode === CliModes.Dev ? 'development' : 'production';
	const entries = await getEntries(args);
	const getConfig = (entry: Entry): InlineConfig => {
		const {
			rootDir,
			inputFile,
			distDir,
		} = entry;

		const userConfig = defineConfig({
			mode,
			root: rootDir,
			publicDir: false,
			cacheDir: '.vite',
			build: {
				outDir: distDir,
				rollupOptions: {
					input: inputFile,
				},
				sourcemap: false,
				manifest: true,
				ssrManifest: true,
			},
			plugins: [
				vue(),
			],
		});

		return {
			...userConfig,
			configFile: false,
			envFile: false,
		};
	};

	return entries.map(getConfig);
};
