import {Cli} from './services';
import {test} from './actions/test';

const args = Cli.handleArgs(Cli.Actions.Test);
await test(args);
