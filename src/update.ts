import {Cli} from './services';
import {update} from './actions/update';

const args = Cli.handleArgs(Cli.Actions.Update);
await update(args);
