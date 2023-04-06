import {Cli} from './services';
import {help} from './actions/help';

const args = Cli.handleArgs(Cli.Actions.Help);
await help(args);
