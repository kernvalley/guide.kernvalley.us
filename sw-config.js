---
layout: null
---
/* eslint-env serviceworker */
/* eslint no-unused-vars: 0 */

async function updateAssets(assets, {
	referrerPolicy = 'no-referrer',
	version = '{{ site.data.app.version | default: site.version }}',
} = {}) {
	if (Array.isArray(assets) && assets.length !== 0) {
		const cache = await caches.open(version);
		await Promise.allSettled(assets.filter(url => url.length !== 0).map(async url => {
			const req = new Request(new URL(url, location.origin), { referrerPolicy: 'no-referrer' });
			const resp = await fetch(req);

			if (resp.ok) {
				await cache.put(req, resp);
			}
		}));
	}
}

const config = {
	version: '{{ site.data.app.version | default: site.version }}',
	fresh: [
		'{{ site.pages | where: "pinned", true | map: "url" | join: "', '" }}',
		'https://apps.kernvalley.us/apps.json',
		'https://events.kernvalley.us/events.json',
		'/webapp.webmanifest',
	].map(path => new URL(path, location.origin).href),
	stale: [
		/* JS */
		'/js/index.min.js',
		'{{ site.data.importmap.imports["@shgysk8zer0/polyfills"] }}',

		/* CSS */
		'/css/index.min.css',

		/* `customElements` templates */

		/* Images & Icons */
		'/img/icons.svg',
		'/img/apple-touch-icon.png',
		'/img/icon-512.png',
		'/img/icon-192.png',
		'/img/icon-32.png',
		'/img/favicon.svg',
		'/favicon.ico',
		'https://cdn.kernvalley.us/img/raster/missing-image.png',
		'https://cdn.kernvalley.us/img/logos/instagram.svg',
		'https://cdn.kernvalley.us/img/keep-kern-clean.svg',
		'https://cdn.kernvalley.us/img/logos/play-badge.svg',
		'https://cdn.kernvalley.us/img/logos/pwa-badge.svg',

		/* Fonts */
		'https://cdn.kernvalley.us/fonts/roboto.woff2',
	].map(path => new URL(path, location.origin).href),
	allowed: [
		'/https://i.imgur.com/',
		/https:\/\/\w+\.githubusercontent\.com\/u\/*/,
		/\.(jpg|png|webp|svg|gif|avif|woff2|woff)$/,
	],
	allowedFresh: [
		'https://www.google-analytics.com/analytics.js',
		'https://www.googletagmanager.com/gtag/js',
		'https://api.github.com/users/',
		/^https:\/\/unpkg\.com\//,
		/\.(html|css|js|json)$/,
	],
	periodicSync: {
		'main-assets': async () => await updateAssets([
			'/',
			'/js/index.min.js',
			'/css/index.min.css',
			'/img/icons.svg',
			'/webapp.webmanifest',
		]),
	},
};

