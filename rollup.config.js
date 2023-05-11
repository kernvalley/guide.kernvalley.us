/* eslint-env node */
import urlResolve from 'rollup-plugin-url-resolve';
import terser from '@rollup/plugin-terser';
import { rollupImport } from '@shgysk8zer0/rollup-import';

export default {
	input: 'js/index.js',
	output: {
		file: 'js/index.min.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		rollupImport(['_data/importmap.yaml']),
		urlResolve(),
		terser(),
	],
};
