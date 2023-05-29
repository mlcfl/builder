import {Option} from 'commander';
import {Modes} from './Modes';

/**
 * Available cli options
 */
export const options = {
	include: new Option(
		'-i, --include <apps...>',
		'Run only for the applications you need. Do not use with "--exclude" option.'
	),
	exclude: new Option(
		'-e, --exclude <apps...>',
		'Exclude some applications from execution. Do not use with "--include" option.'
	),
	includeParts: new Option(
		'-ip, --include-parts <parts...>',
		'Run only the parts you need. Do not use with "--exclude-parts" option.'
	),
	excludeParts: new Option(
		'-ep, --exclude-parts <parts...>',
		'Exclude some parts from execution. Do not use with "--include-parts" option.'
	),
	strict: new Option(
		'-s, --strict',
		'Strict mode is used with "include/exclude" options. With this option you can specify the "common" parts and the "documents" directory.'
	),
	mode: new Option(
		'-m, --mode <mode>',
		'Mode type'
	).choices(Object.values(Modes)).hideHelp(),
	// Only for "build:dev" or "start:dev" action
	watch: new Option(
		'-w, --watch',
		'Run in watch mode to watch changes and rebuild on the fly.'
	),
	// Only for "build:dev" or "start:dev" action
	buildOnly: new Option(
		'-bo, --build-only <part>',
		'Compiling frontend only or backend only. Both if not specified.'
	).choices(['frontend', 'backend']),
	// Only for "reinstall" action
	reinstall: new Option(
		'-r, --reinstall',
		`There are no questions in the "reinstall" mode. Personal data won't be deleted.`
	).hideHelp(),
};
