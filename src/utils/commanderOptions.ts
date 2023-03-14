import {Option} from 'commander';
import {Modes} from '../services/Modes';// to avoid circular dependency
import {CommanderOptionsTypes} from './commanderOptions.types';

const commanderOptions = {
	include: new Option(
		'-i, --include <apps...>',
		'Run only for the applications you need. Do not use with "--exclude" option.'
	),
	exclude: new Option(
		'-e, --exclude <apps...>',
		'Exclude some applications from execution. Do not use with "--include" option.'
	),
	watch: new Option(
		'-w, --watch',
		'Run in watch mode to watch changes and rebuild on the fly.'
	),
	reinstall: new Option(
		'-r, --reinstall',
		`There are no questions in the "reinstall" mode. Personal data won't be deleted.`
	).hideHelp(),
	mode: new Option(
		'-m, --mode <mode>',
		'Mode type'
	).choices(Modes.toArray()).hideHelp(),
};

export {
	commanderOptions,
	CommanderOptionsTypes,
};
