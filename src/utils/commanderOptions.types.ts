import {ModeOptions} from '../services/Modes';

export namespace CommanderOptionsTypes {
	export interface IncludeExclude {
		readonly include?: string[];
		readonly exclude?: string[];
	};

	export interface Build extends IncludeExclude {
		readonly mode: ModeOptions;
		readonly watch?: boolean;// in "start:dev --watch" mode
	}

	export interface Start extends IncludeExclude {
		readonly mode: ModeOptions;
		readonly watch?: boolean;
	}
}
