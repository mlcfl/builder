import {Cli, CliModes} from './services';
import {build} from './actions/build';

const args = Cli.handleArgs(Cli.Actions.Build);

// Set NODE_ENV immediately after arguments parsing.
// Such code exists in two actions: build and start.
// NODE_ENV is an important variable used by Node and other tools (e.g. Vite)
process.env.NODE_ENV = args.mode === CliModes.Dev ? 'development' : 'production';

await build(args);
