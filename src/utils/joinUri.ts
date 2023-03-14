/**
 * Safe URI concatenation
 */
export const joinUri = (base: string, path: string): string => {
	const {pathname} = new URL(base);
	const {href} = new URL([pathname, path].join('/'), base);

	return href;
};
