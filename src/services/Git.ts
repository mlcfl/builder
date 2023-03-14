import shell from 'shelljs';
import {Fs} from './Fs';
import {Console} from './Console';
import {joinUri} from '../utils';
import {config} from '../config';

/**
 * Work with remote repositories
 */
export class Git {
	/**
	 * Clone repository from the remote URI
	 */
	static clone(remoteUri: string, rename = ''): void {
		const {code} = shell.exec(`git clone ${remoteUri}.git ${rename}`);
		const success = code === 0;

		if (!success) {
			Console.error(`Something went wrong with cloning "${remoteUri}". Probably it already exists or you don't have enough permissions to clone it.`);
		}
	}

	/**
	 * Pull from the remote URI
	 */
	static pull(path: string): void {
		Fs.cd(Fs.absoluteRootPath, path);

		const {code} = shell.exec('git pull');
		const success = code === 0;

		if (!success) {
			Console.error(`Something went wrong with updating "${path}". Probably you don't have enough permissions to update it.`);
		}
	}

	/**
	 * Return git URI to a repository
	 */
	static getUri(relativePart: string): string {
		return joinUri(config.remoteRepositoryUri, relativePart);
	}
}
