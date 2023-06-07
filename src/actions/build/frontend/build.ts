import {build as viteBuild, type InlineConfig} from 'vite';
import {Console} from '~/services';

/**
 * Only build
 */
export const build = async (configs: InlineConfig | InlineConfig[]): Promise<void> => {
	Console.info('Starting frontend building...');

	configs = Array.isArray(configs) ? configs : [configs];

	for (const config of configs) {
		await viteBuild(config);
	}

	Console.success('Frontend building successfully completed.');
};
