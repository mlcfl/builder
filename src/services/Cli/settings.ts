import {Option} from 'commander';
import {Actions} from './Actions';
import {Modes} from './Modes';
import {options} from './options';
import {config} from '~/config';

type SettingsItem = {
	readonly description: string | ((mode: Modes) => string),
	readonly options: Option[],
};

/**
 * Return human-understandable mode ending
 */
const getHumanText = (mode: Modes): string => {
	return {
		[Modes.Dev]: 'development mode',
		[Modes.Test]: 'production mode with configuration for test server',
		[Modes.Prod]: 'production mode',
	}[mode];
}

const {
	projectName,
	projectRootDirName,
} = config;

const {
	include,
	exclude,
	includeParts,
	excludeParts,
	strict,
	mode,
	watch,
	reinstall,
} = options;

const base = [
	include,
	exclude,
	includeParts,
	excludeParts,
	strict,
];

/**
 * Actions settings (description, options, etc.)
 */
export const settings: Record<Actions, SettingsItem> = {
	help: {
		description: 'Displays all available commands.',
		options: [],
	},
	install: {
		description: `Installs ${projectName}. Creates a directory structure and clones all required repositories from a remote git repository.`,
		options: base,
	},
	uninstall: {
		description: `Uninstalls ${projectName}. Deletes all directories except "builder" and ".github" (if you have it). You can choose to keep your personal data. Also it doesn't delete other files in the "${projectRootDirName}" directory.`,
		options: [reinstall],
	},
	reinstall: {
		description: `Reinstalls ${projectName}. Calls commands "uninstall" and "install" in sequence. Saves personal data.`,
		options: [...base, reinstall],
	},
	update: {
		description: 'Updates the entire infrastructure of the project. Calls "git pull" on the "builder", "documents" and other directories. Then calls "pnpm install" for all required directories.',
		options: base,
	},
	test: {
		description: 'Runs tests. You can choose the environment, test type, etc. Just follow the instructions inside. You should build the project before tests.',
		options: [],
	},
	build: {
		description: (mode: Modes): string => `Builds the project in ${getHumanText(mode)}.`,
		options: [...base, mode, watch],
	},
	start: {
		description: (mode: Modes): string => {
			const opening = mode === Modes.Dev ? 'Builds and starts' : 'Starts';
			return `${opening} the project in ${getHumanText(mode)}.`;
		},
		options: [...base, mode, watch],
	},
};
