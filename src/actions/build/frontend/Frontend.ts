import {pathToFileURL} from 'node:url';
import {EventEmitter} from 'node:events';
import {join, parse, extname} from 'node:path';
import {readdir, writeFile} from 'node:fs/promises';
import type {InlineConfig, Manifest} from 'vite';
import vue from '@vitejs/plugin-vue';
import {minify} from 'html-minifier-terser';
import {Fs, CliModes, Console, type CliArgs} from '~/services';
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
		const {entryServer, template, pages} = entryConfig;
		const {name} = parse(entryServer);
		const manifestPath = join(distDir, '/manifest.json');
		const manifestSsrPath = join(distDir, '/ssr-manifest.json');
		const mainAssets = await this._getMainAssetsHtml(manifestPath);
		const manifestSsr = await Fs.readFile<Record<string, string[]>>(manifestSsrPath);
		const {href} = pathToFileURL(join(distDir, `/.server/${name}.js`));
		const {render} = await import(href);
		const routes = await this._getRoutesToTransform(rootDir, pages);

		// Create SSG pages
		for (const route of routes) {
			const {html, assets: extraAssets} = await render(route, manifestSsr);
			const assets = mainAssets + extraAssets;
			const page = await this._getHtml(join(rootDir, template), {html, assets});
			const distFile = route === '/' ? `/${entryName}.html` : `${route}.html`;

			await writeFile(join(distDir, distFile), page);
		}

		// Remove unused
		await Fs.rm(
			manifestPath,
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
			const {entryClient, template} = entryConfig;
			// @see https://github.com/vitejs/vite/discussions/9400
			// @see https://stackoverflow.com/questions/71295772/in-vite-is-there-a-way-to-update-the-root-html-name-from-index-html
			const root = template ? join(rootDir, 'src') : rootDir;
			const input = template
				? join(rootDir, template)
				: (entryClient ? join(rootDir, entryClient) : null);

			if (!input) {
				Console.error(`Frontend CSR build, application "${app.name}", entry "${entryName}": neither the "template" field nor the "entryClient" field was found in the configuration file.`);
			}

			const viteConfig: InlineConfig = {
				...common,
				root,
				build: {
					...common.build,
					emptyOutDir: true,
					rollupOptions: {
						input,
					},
				},
				plugins: [
					...(common.plugins ?? []),
					htmlMinifier({
						removeComments: true,
						collapseWhitespace: true,
					}),
				],
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

		const {rootDir, distDir, tsConfigPath} = app;
		const common = this._getCommonConfig(app);

		for (const [entryName, entryConfig] of Object.entries(appConfig)) {
			const {entryClient, entryServer} = entryConfig;
			const viteConfig: InlineConfig[] = [
				// Compile SPA to get assets
				{
					...common,
					build: {
						...common.build,
						manifest: true,
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
						emptyOutDir: true,
						ssr: true,
						rollupOptions: {
							input: join(rootDir, entryServer),
							external: external(app),
							plugins: [
								pluginAliases(),
							],
						},
					},
					root: tsConfigPath,
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
			},
			plugins: [
				vue(),
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
	 * Return html for the main assets
	 */
	private async _getMainAssetsHtml(manifestPath: string): Promise<string> {
		const manifest = await Fs.readFile<Manifest>(manifestPath);

		return Object.entries(manifest).reduce<string>((assets, [, {isEntry, file, css}]) => {
			if (isEntry) {
				const jsHtml = this._getHeadLinks(file);
				const cssHtml = css ? css.map(this._getHeadLinks) : [];
				assets += cssHtml.join('') + jsHtml;
			}

			return assets;
		}, '');
	}

	/**
	 * Return html tags for different assets
	 */
	private _getHeadLinks(path: string): string {
		const ext = extname(path);
		const prefix = path[0] === '/' ? '' : '/';

		return {
			'.js': `<script type="module" crossorigin src="${prefix}${path}"></script>`,
			'.css': `<link rel="stylesheet" href="${prefix}${path}">`,
		}[ext] ?? '';
	}

	/**
	 * Return full html
	 */
	private async _getHtml(templatePath: string, data: Record<string, string>): Promise<string> {
		const template = await Fs.readFile(templatePath, false);

		// Minify before replace to do it faster
		let minified = await minify(template, {
			removeComments: false,
			collapseWhitespace: true,
		});

		for (const [mask, content] of Object.entries(data)) {
			minified = minified.replace(`<!--[${mask}]-->`, content);
		}

		return minified;
	}
}
