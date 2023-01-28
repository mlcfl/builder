import chalk from 'chalk';

/**
 * Colored console outputs
 */

export const warning = (text) => console.warn(chalk.yellow(`Warning: ${text}`));

export const error = (text) => console.error(chalk.red(`Error: ${text}`));

export const success = (text) => console.log(chalk.green(`Success: ${text}`));
