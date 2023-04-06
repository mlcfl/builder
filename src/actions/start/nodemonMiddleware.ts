import {Cli} from '~/services';
import {bootProject} from './bootProject';

// Arguments are parsed a second time if called by nodemon
const args = Cli.handleArgs(Cli.Actions.Start);
await bootProject(args);
