import {Cli} from './services';
import {uninstall} from './actions/uninstall';

const args = Cli.handleArgs(Cli.Actions.Uninstall);
await uninstall(args);
