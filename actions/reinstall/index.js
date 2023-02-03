import {argv} from 'process';
import shell from 'shelljs';
import {error, success} from '../../utils/console.js';
import {config} from '../../utils/config.js';

/**
 * Entry
 */
(() => {
	const {code} = shell.exec('node actions/uninstall/index.js --reinstall');

	if (code !== 3) {
		error('Something went wrong during the uninstall process. Operation stopped.');
		return;
	}

	shell.exec(`node actions/install/index.js ${argv.slice(2).join(' ')}`).code > 0
		? error('Something went wrong during the install process.')
		: success(`Application ${config.appName} was successfully reinstalled.`);
})();
