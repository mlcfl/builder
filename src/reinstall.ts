import {Cli, Console} from './services';
import {install} from './actions/install';
import {uninstall} from './actions/uninstall';
import {config} from './config';

/**
 * Reinstallation process
 */
const args = Cli.handleArgs(Cli.Actions.Reinstall);
await uninstall(args);
await install(args);
Console.success(`Project ${config.projectName} was successfully reinstalled.`);
