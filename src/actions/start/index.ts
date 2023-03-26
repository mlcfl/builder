import {handleCliArgs} from './handleCliArgs';// special import
import {start} from './start';

// Arguments are parsed a second time if called by nodemon
const args = handleCliArgs(true);

await start(args);
