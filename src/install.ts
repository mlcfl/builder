import {Cli} from './services';
import {install} from './actions/install';

const args = Cli.handleArgs(Cli.Actions.Install);
await install(args);
