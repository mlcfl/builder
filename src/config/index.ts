/**
 * Import the config file from ".json"
 * Why so? To discourage the use of complex types in ".js" -> used ".json" config file
 */
import json from './config.json';

export const config = Object.freeze(json);
