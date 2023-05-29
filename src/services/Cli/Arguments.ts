import {OptionValues} from 'commander';
import {Modes} from './Modes';

// Used in the "Project" class
export type Base = {
	readonly include?: string[];
	readonly exclude?: string[];
	readonly includeParts?: string[];
	readonly excludeParts?: string[];
	readonly strict?: boolean;
}

type ReinstallOption = {
	readonly reinstall?: boolean;
}

type BuildStart = {
	readonly mode: Modes;
	readonly watch?: boolean;// in "start:dev --watch" mode
	readonly buildOnly?: 'frontend' | 'backend';
}

/**
 * Possible results after parsing cli arguments
 */
export namespace Arguments {
	export type Help = OptionValues;
	export type Install = Base;
	export type Uninstall = ReinstallOption;
	export type Reinstall = Base & Required<ReinstallOption>;
	export type Update = Base;
	export type Test = OptionValues;
	export type Build = Base & BuildStart;
	export type Start = Base & BuildStart;

	export type All = Help
		| Install
		| Uninstall
		| Reinstall
		| Update
		| Test
		| Build
		| Start;
}
