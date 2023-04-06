export type Writeable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
