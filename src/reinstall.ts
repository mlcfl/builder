import {program} from 'commander';
import {Console} from './services';
import {commanderOptions} from './utils';
import {config} from './config';

const {projectName} = config;

/**
 * Entry
 */
program
	.description(`Reinstalls ${projectName}. Calls commands "uninstall" and "install" in sequence. Saves personal data.`)
	.addOption(commanderOptions.include)
	.addOption(commanderOptions.exclude)
	.addOption(commanderOptions.reinstall)
	.parse();

await import('./uninstall');
await import('./install');

Console.success(`Project ${projectName} was successfully reinstalled.`);
