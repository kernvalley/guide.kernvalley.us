/* eslint-env node */
import { getConfig } from '@shgysk8zer0/js-utils/rollup';
import { rollupImport, rollupImportMeta } from '@shgysk8zer0/rollup-import';

export default getConfig('./js/index.js', {
	plugins: [
		rollupImport('_data/importmap.yml'),
		rollupImportMeta({ baseURL: 'https://guide.kernvalley.us/' }),
	],
	format: 'iife',
	minify: true,
	sourcemap: true,
});
