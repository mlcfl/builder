export type Env = {
	readonly MODE: 'development' | 'test' | 'production',
	readonly HOST: string,
	readonly SERVER_PORT: number,
};
