import {type InlineConfig} from 'vite';
import {type Entry} from './getEntries';

/**
 * Vite config mode
 */
export type ConfigMode = 'development' | 'production';

/**
 * Entry point options
 */
export type EntryPointCsrOptions = {
	readonly entryClient: string;// path to CSR entry (.html file in the root directory)
};

export type EntryPointSsrOptions = {};

export type EntryPointSsgOptions = {
	readonly entryClient: string;// path to CSR entry (.html file in the root directory)
	readonly entryServer: string;// path to SSR entry (.ts file)
	readonly pages?: string[];// pages to compile, if does not exist - all pages
};

/**
 * List of entry points
 */
export type AppConfigCsr = {
	readonly [entryPoint: string]: EntryPointCsrOptions;
};

export type AppConfigSsr = {
	readonly [entryPoint: string]: EntryPointSsrOptions;
};

export type AppConfigSsg = {
	readonly [entryPoint: string]: EntryPointSsgOptions;
};

/**
 * Application configuration file
 */
export type AppConfig = {
	readonly csr?: AppConfigCsr;
	readonly ssr?: AppConfigSsr;
	readonly ssg?: AppConfigSsg;
};

/**
 * Event types
 */
type ConfigByType = {
	readonly type: 'csr';
	readonly entryConfig: EntryPointCsrOptions;
} | {
	readonly type: 'ssr';
	readonly entryConfig: EntryPointSsrOptions;
} | {
	readonly type: 'ssg';
	readonly entryConfig: EntryPointSsgOptions;
};

export type ReadyToBuildArgs = ConfigByType & {
	readonly app: Entry;
	readonly entryName: string;
	readonly viteConfig: InlineConfig | InlineConfig[];
};
