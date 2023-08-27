import {pathToFileURL} from 'node:url';
import {EventEmitter} from 'node:events';
import {join, parse} from 'node:path';
import {readdir, writeFile} from 'node:fs/promises';
import type {InlineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {Fs, CliModes, type CliArgs} from '~/services';
import {external} from '../external';
import {pluginAliases} from '../plugins';
import {getEntries, type Entry} from './getEntries';
import {htmlMinifier} from './plugins';
import type {
	ConfigMode,
	AppConfig,
	AppConfigCsr,
	AppConfigSsr,
	AppConfigSsg,
	EntryPointSsgOptions,
} from './types';

enum Events {
	ReadyToBuild = 'readyToBuild',
};

export class Frontend {
	static Events = Events;

	private _emitter = new EventEmitter();
	private _args: CliArgs.Build;
	private _isDev: boolean;
	private _configMode: ConfigMode;

	constructor(args: CliArgs.Build) {
		this._args = args;
		this._isDev = this._args.mode === CliModes.Dev;
		this._configMode = this._isDev ? 'development' : 'production';
	}

	get emitter(): EventEmitter {
		return this._emitter;
	}

	/**
	 * Get Vite configuration for each entry file and prepare them for building
	 */
	async prepare(): Promise<void> {
		const apps = await getEntries(this._args);

		for (const app of apps) {
			const {configPath} = app;
			const {csr, ssr, ssg} = await Fs.readFile<AppConfig>(configPath);

			await Promise.all([
				this._prepareCsr(app, csr),
				this._prepareSsr(app, ssr),
				this._prepareSsg(app, ssg),
			]);
		}
	}

	/**
	 * Transform CSR & SSR to SSG
	 */
	async transformToSsg(app: Entry, entryConfig: EntryPointSsgOptions, entryName: string): Promise<void> {
		const {rootDir, distDir} = app;
		const {entryClient, entryServer, pages} = entryConfig;
		const {name} = parse(entryServer);
		const manifestSsrPath = join(distDir, '/ssr-manifest.json');
		const manifestSsr = await Fs.readFile<Record<string, string[]>>(manifestSsrPath);
		const {href} = pathToFileURL(join(distDir, `/.server/${name}.js`));
		const {render} = await import(href);
		const routes = await this._getRoutesToTransform(rootDir, pages);
		const template = await Fs.readFile(join(distDir, entryClient), false);

		// Create SSG pages
		for (const route of routes) {
			const {html, assets} = await render(route, manifestSsr);
			const page = this._replaceMasks(template, {html, assets});
			const distFile = route === '/' ? `/${entryName}.html` : `${route}.html`;

			await writeFile(join(distDir, distFile), page);
		}

		// Remove unused
		await Fs.rm(
			manifestSsrPath,
			join(distDir, '/.server'),
		);
	}

	/**
	 * Prepare SPA/CSR (Client Side Rendering)
	 */
	private async _prepareCsr(app: Entry, appConfig?: AppConfigCsr): Promise<void> {
		if (!appConfig || !Object.keys(appConfig).length) {
			return;
		}

		const {rootDir} = app;
		const common = this._getCommonConfig(app);

		for (const [entryName, entryConfig] of Object.entries(appConfig)) {
			const {entryClient} = entryConfig;
			const viteConfig: InlineConfig = {
				...common,
				build: {
					...common.build,
					rollupOptions: {
						input: join(rootDir, entryClient),
					},
				},
			};

			this.emitter.emit(Events.ReadyToBuild, {
				app,
				entryName,
				entryConfig,
				viteConfig,
				type: 'csr',
			});
		}
	}

	/**
	 * Prepare SSR (Server Side Rendering)
	 */
	private async _prepareSsr(entry: Entry, appConfig?: AppConfigSsr): Promise<void> {
		if (!appConfig || !Object.keys(appConfig).length) {
			return;
		}

		// ...
	}

	/**
	 * Prepare SSG (Static Site Generator)
	 */
	private async _prepareSsg(app: Entry, appConfig?: AppConfigSsg): Promise<void> {
		if (!appConfig || !Object.keys(appConfig).length) {
			return;
		}

		const {rootDir, distDir} = app;
		const common = this._getCommonConfig(app);

		for (const [entryName, entryConfig] of Object.entries(appConfig)) {
			const {entryClient, entryServer} = entryConfig;
			const viteConfig: InlineConfig[] = [
				// Compile SPA to get assets
				{
					...common,
					build: {
						...common.build,
						ssrManifest: true,
						rollupOptions: {
							input: join(rootDir, entryClient),
						},
					},
				},
				// Compile SSR to transform then into SSG
				{
					...common,
					build: {
						...common.build,
						outDir: join(distDir, '/.server'),
						ssr: true,
						rollupOptions: {
							input: join(rootDir, entryServer),
							external: external(app),
							plugins: [
								pluginAliases(),
							],
						},
					},
				},
			];

			this.emitter.emit(Events.ReadyToBuild, {
				app,
				entryName,
				entryConfig,
				viteConfig,
				type: 'ssg',
			});
		}
	}

	/**
	 * Return common parts of the Vite config
	 */
	private _getCommonConfig(app: Entry): InlineConfig {
		const {rootDir, distDir} = app;

		return {
			mode: this._configMode,
			configFile: false,
			envFile: false,
			publicDir: false,
			cacheDir: '.vite',
			root: rootDir,
			build: {
				outDir: distDir,
				minify: this._isDev ? false : 'esbuild',
				copyPublicDir: false,
				sourcemap: false,
				emptyOutDir: true,
			},
			plugins: [
				vue(),
				htmlMinifier({
					removeComments: false,
					collapseWhitespace: true,
				}),
			],
		};
	}

	/**
	 * Return pages for transformation
	 */
	private async _getRoutesToTransform(rootDir: string, pages?: string[]) {
		pages = pages ?? await readdir(join(rootDir, '/src/pages'));

		return pages.map((page) => {
			const name = parse(page).name.toLowerCase();
			// If Root.vue - it's root path "/"
			return name === 'root' ? '/' : `/${name}`;
		});
	}

	/**
	 * Replace masks in html template to content
	 */
	private _replaceMasks(template: string, data: Record<string, string>): string {
		for (const [mask, content] of Object.entries(data)) {
			template = template.replace(`<!--[${mask}]-->`, content);
		}

		return template;
	}
}
