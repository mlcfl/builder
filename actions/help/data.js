import {config} from '../../utils/config.js';

const {appName, githubName} = config;

export const data = [
	// Help
	{
		command: 'help',
		description: 'Displays all available commands.',
	},
	// Install
	{
		command: 'install',
		options: [
			'--include app1,app2,appN',
			'--exclude app1,app2,appN',
		],
		description: `Installs ${appName}. Creates a folder structure and clones all needed repositories from GitHub. You can use one of the additional options to install only the applications you need, or to exclude some applications from installation. Do not use spaces in applications enumeration in options.`,
	},
	// Uninstall
	{
		command: 'uninstall',
		description: `Uninstalls ${appName}. Deletes all folders except "builder" and ".github" (if you have it). You can choose to keep your personal data. Also it doesn't delete other files in "${githubName}" folder.`,
	},
	// Reinstall
	{
		command: 'reinstall',
		description: `Reinstalls ${appName}. Calls commands "uninstall" and "install" in sequence. Saves personal data.`,
	},
	// Update
	{
		command: 'update',
		options: [
			'--include app1,app2,appN',
			'--exclude app1,app2,appN',
		],
		description: 'Updates the entire infrastructure of the application. Calls "git pull" on the "builder", "documents" and "src" folders. Then calls "npm i" for all required folders. You can use one of the additional options to update only the applications you need, or to exclude some applications from update. Do not use spaces in applications enumeration in options.',
	},
	// Test
	{
		command: 'test',
		description: 'Runs tests. You can choose the environment, test type, etc. Just follow the instructions inside. You should build the application before tests.',
	},
	// Build
	{
		command: 'build',
		options: [
			'--include app1,app2,appN',
			'--exclude app1,app2,appN',
		],
		description: 'Builds the application in production mode. You can use one of the additional options to build only the applications you need, or to exclude some applications from build. Do not use spaces in applications enumeration in options.',
	},
	// Build:test
	{
		command: 'build:test',
		options: [
			'--include app1,app2,appN',
			'--exclude app1,app2,appN',
		],
		description: 'Builds the application in production mode with configuration for test server. You can use one of the additional options to build only the applications you need, or to exclude some applications from build. Do not use spaces in applications enumeration in options.',
	},
	// Start
	{
		command: 'start',
		options: [
			'--include app1,app2,appN',
			'--exclude app1,app2,appN',
		],
		description: 'Starts the application in production mode. You can use one of the additional options to start only the applications you need, or to exclude some applications from launch. Do not use spaces in applications enumeration in options.',
	},
	// Start:dev
	{
		command: 'start:dev',
		options: [
			'--include app1,app2,appN',
			'--exclude app1,app2,appN',
			'--watch',
		],
		description: 'Builds and starts the application in development mode. You can use the "--watch" option to watch changes and rebuild on the fly. Also you can use one of the additional options to build and start only the applications you need, or to exclude some applications from build and launch. Do not use spaces in applications enumeration in options.',
	},
	// Start:test
	{
		command: 'start:test',
		options: [
			'--include app1,app2,appN',
			'--exclude app1,app2,appN',
		],
		description: 'Starts the application in production mode with configuration for test server. You can use one of the additional options to start only the applications you need, or to exclude some applications from launch. Do not use spaces in applications enumeration in options.',
	},
];
