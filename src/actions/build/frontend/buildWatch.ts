import {
	createServer,
	type InlineConfig,
	type ViteDevServer,
} from 'vite';
import {Console} from '~/services';

/**
 * Build in "watch" mode
 */
export const buildWatch = async (configs: InlineConfig[]): Promise<ViteDevServer[]> => {
	Console.info('Starting frontend building in "watch" mode...');
	const result = [];

	for (const config of configs) {
		const server = await createServer(config);
		await server.listen();
		server.printUrls();
		result.push(server);
	}

	return result;
};
