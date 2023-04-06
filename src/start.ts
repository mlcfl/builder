import {Cli} from './services';
import {start} from './actions/start';

const args = Cli.handleArgs(Cli.Actions.Start);
await start(args);
