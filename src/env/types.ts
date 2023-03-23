export type Env = {
	readonly MODE: 'development' | 'test' | 'production',
	readonly SERVER_PORT: number,
	readonly SUBDOMAIN_OFFSET: number,
};
