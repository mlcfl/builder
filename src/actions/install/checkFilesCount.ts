import {readdir} from 'node:fs/promises';
import {Fs, Console} from '~/services';

/**
 * Check files count in the root directory after installation
 */
export const checkFilesCount = async (): Promise<void> => {
	const maxFilesCount = [5, 6];// 6 if ".github" directory exists
	const {length} = await readdir(Fs.absoluteRootPath);

	if (!maxFilesCount.includes(length)) {
		Console.warning(`Hmm, I expected ${maxFilesCount.join(' or ')} files in the root project directory, but you have ${length}. Why so, dear? 🙃`);
	}
};
