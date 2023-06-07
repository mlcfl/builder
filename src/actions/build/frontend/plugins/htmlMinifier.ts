import {PluginOption, Plugin} from 'vite';
import {minify, Options} from 'html-minifier-terser';

/**
 * HTML minifier
 * @author https://github.com/tcly861204/vite-plugin-html-minifier-terser
 */
export const htmlMinifier = (config?: Options): Plugin | PluginOption => {
	return {
		name: 'html-minifier',
		apply: 'build',
		enforce: 'post',
		async generateBundle(options, outBundle) {
			for (const bundle of Object.values(outBundle)) {
				const {type, fileName} = bundle;
				const isAsset = type === 'asset';

				if (isAsset && /\.html$/i.test(fileName) && typeof bundle.source === 'string') {
					bundle.source = await minify(bundle.source, config);
				}
			}
		},
	}
};
