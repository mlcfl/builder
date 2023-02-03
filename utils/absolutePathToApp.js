import {fileURLToPath} from 'url';
import {join, dirname} from 'path';

const pathname = dirname(fileURLToPath(import.meta.url));

/**
 * Absolute path to the main application
 */
export const absolutePathToApp = join(pathname, '/../..');
