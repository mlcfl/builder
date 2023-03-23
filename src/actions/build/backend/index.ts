import {exit} from 'node:process';
import {rollup} from 'rollup';
import chalk from 'chalk';
import {Console} from '~/services';
import {CommanderOptionsTypes} from '~/utils';
import {getConfigs} from './config';

export const backend = async (args: CommanderOptionsTypes.Build): Promise<void> => {
	Console.info('Starting backend building...');
	const configs = getConfigs(args);

	for (const {output, ...input} of configs) {
		if (!output || Array.isArray(output)) {
			Console.warning(`Invalid "output" field in the backend configuration. Must be "[object Object]", but ${Object.prototype.toString.call(output)} found.`);
			continue;
		}

		try {
			const bundle = await rollup(input);
			await bundle.write(output);
			await bundle.close();
		} catch (e) {
			if (e instanceof Error) {
				const {name, message} = e;
				const code = 'code' in e ? `(code ${e.code})` : '';
				const plugin = 'plugin' in e ? `(plugin ${e.plugin})` : '';
				const entry = 'id' in e ? `Entry file: ${e.id}\n` : '';
				const intro = [name, code, plugin].join(' ') + ':\n';
				const text = chalk.red(intro) + entry + message;

				console.error(text);
				exit(1);
			}

			throw e;
		}
	}

	Console.success('Backend building successfully completed.');
};
