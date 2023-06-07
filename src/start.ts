import {Cli, CliModes} from './services';
import {start} from './actions/start';

const args = Cli.handleArgs(Cli.Actions.Start);

// Set NODE_ENV immediately after arguments parsing.
// Such code exists in two actions: build and start.
// NODE_ENV is an important variable used by Node and other tools (e.g. Vite)
process.env.NODE_ENV = args.mode === CliModes.Dev ? 'development' : 'production';

await start(args);
