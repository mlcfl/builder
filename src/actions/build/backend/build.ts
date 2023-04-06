import {rollup, RollupOptions} from 'rollup';
import {Console} from '~/services';
import {handleError} from './handleError';

/**
 * Only build
 */
export const build = async (configs: RollupOptions[]): Promise<void> => {
	Console.info('Starting backend building...');

	for (const {output, ...input} of configs) {
		if (!output || Array.isArray(output)) {
			Console.warning(`Invalid "output" field in the backend configuration. Must be "[object Object]", but ${Object.prototype.toString.call(output)} found. Step skipped.`);
			continue;
		}

		try {
			const bundle = await rollup(input);
			await bundle.write(output);
			await bundle.close();
		} catch (e) {
			handleError(e);
		}
	}

	Console.success('Backend building successfully completed.');
};
