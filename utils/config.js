import {createRequire} from 'module';

const require = createRequire(import.meta.url);

/**
 * Import config file from .json
 *
 * Why so? To discourage the use of complex types in .js -> used .json config file
 */
export const config = require('../config.json');
