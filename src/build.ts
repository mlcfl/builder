import {Cli} from './services';
import {build} from './actions/build';

const args = Cli.handleArgs(Cli.Actions.Build);
await build(args);
