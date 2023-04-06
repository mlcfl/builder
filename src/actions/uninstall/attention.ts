import chalk from 'chalk';

/**
 * Underline text
 */
export const attention = (text: string): string => chalk.bold.underline(text);
