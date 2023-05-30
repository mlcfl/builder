import {build as viteBuild, type InlineConfig} from 'vite';
import {Console} from '~/services';

/**
 * Only build
 */
export const build = async (configs: InlineConfig[]): Promise<void> => {
	Console.info('Starting frontend building...');

	for (const config of configs) {
		await viteBuild(config);
	}

	Console.success('Frontend building successfully completed.');
};
