import typescript from 'rollup-plugin-typescript2';

/**
 * Resolve TypeScript files
 */
export const pluginTypescript = (tsconfig: string) => typescript({tsconfig});
