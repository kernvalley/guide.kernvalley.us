import '@shgysk8zer0/kazoo/theme-cookie.js';
import './components.js';
import { DAYS } from '@shgysk8zer0/kazoo/date-consts.js';
import { prefersReducedMotion } from '@shgysk8zer0/kazoo/media-queries.js';
import { ready, loaded, query, on, toggleClass, each, map, addClass, intersect } from '@shgysk8zer0/kazoo/dom.js';
import { init } from '@shgysk8zer0/kazoo/data-handlers.js';
import { createPolicy } from '@shgysk8zer0/kazoo/trust.js';
import { getGooglePolicy } from '@shgysk8zer0/kazoo/trust-policies.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from '@shgysk8zer0/kazoo/google-analytics.js';
import { GA } from './consts.js';
import { installPrompt } from './functions.js';

toggleClass([document.documentElement], {
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

if (typeof GA === 'string' && GA.length !== 0) {
	const policy = getGooglePolicy();

	scheduler.postTask(async () => {
		const { ga, hasGa } = await importGa(GA, {}, { policy });

		if (hasGa()) {
			ga('create', GA, 'auto');
			ga('set', 'transport', 'beacon');
			ga('send', 'pageview');

			on('a[rel~="external"]', 'click', externalHandler, { passive: true, capture: true });
			on('a[href^="tel:"]', 'click', telHandler, { passive: true, capture: true });
			on('a[href^="mailto:"]', 'click', mailtoHandler, { passive: true, capture: true });
		}
	}, { priority: 'background' });
} else {
	createPolicy('goog#html', {});
	createPolicy('goog#script-url', {});
	getGooglePolicy();
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.ready.then(async reg => {
		if ('periodicSync' in reg && 'permissions' in navigator) {
			const { state } = await navigator.permissions.query({ name: 'periodic-background-sync' });

			if (state === 'granted') {
				reg.periodicSync.register('main-assets', { minInterval: 7 *  DAYS }).catch(console.error);
				reg.periodicSync.register('pinned-pages', { minInterval: 2 * DAYS }).catch(console.error);
			}
		}
	});
}

if (location.pathname !== '/' && location.hash.length > 1) {
	loaded().then(() => {
		const target = document.getElementById(location.hash.substr(1));
		if (target instanceof HTMLElement) {
			target.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}
	});
}

ready().then(() => {
	init();

	customElements.whenDefined('install-prompt').then(() => {
		on('#install-btn', 'click', () => installPrompt()).forEach(btn => btn.hidden = false);
	});

	if (location.pathname !== '/') {
		if (('IntersectionObserver' in window) && ! prefersReducedMotion()) {
			const items = addClass('.business-listing', 'hidden');

			intersect(items, ({ isIntersecting, target }) => {
				if (isIntersecting) {
					target.animate([{
						transform: 'rotateX(-30deg) scale(0.85)',
						opacity: 0.3,
					}, {
						transform: 'none',
						opacity: 1,
					}], {
						duration: 300,
						easing: 'ease-in-out',
					});
				}

				target.classList.toggle('hidden', ! isIntersecting );
			});
		}

		on('#searchForm, #titlebarSearch', {
			submit: async event => {
				event.preventDefault();
				const data = new FormData(event.target);
				const name = data.get('name').toLowerCase();

				if (Element.prototype.animate instanceof Function) {
					await Promise.all(map('#main .business-listing[title]', el => {
						const matches = el.title.toLowerCase().includes(name);

						if (matches && el.hidden) {
							const anim = el.animate([{
								transform: 'scale(0.1)',
								opacity: 0,
							}, {
								transform: 'none',
								opacity: 1
							}], {
								duration: 400,
								easing: 'ease-in-out',
								fill: 'forwards',
							});

							el.hidden = false;
							return anim.finished;
						} else if (! matches && ! el.hidden) {
							return el.animate([{
								transform: 'none',
								opacity: 1
							}, {
								transform: 'scale(0.1)',
								opacity: 0,
							}], {
								duration: 400,
								easing: 'ease-in-out',
								fill: 'forwards',
							}).finished.then(() => el.hidden = true);
						}
					}));
				} else {
					each('#main .business-listing[title]', el => {
						el.hidden = ! el.title.toLowerCase().includes(name);
					});
					return Promise.resolve();
				}

				const matched = document.querySelector('#main .business-listing:not([hidden])');

				if (matched instanceof HTMLElement) {
					// @TODO: Update page title with place title
					// @TODO: Update URL hash to be place id
					// if (matched.id !== '') {
					// 	const url = new URL(location.href);
					// 	url.hash = `#${matched.id}`;
					// 	location.hash = url.hash;
					// 	history.replaceState(history.state, document.title, url.href);
					// }

					requestAnimationFrame(() => {
						matched.scrollIntoView({ behavior: 'smooth', block: 'end' });
					});
				}
			},
			reset: () => {
				if (Element.prototype.animate instanceof Function) {
					each('#main .business-listing[hidden]', el => {
						el.animate([{
							transform: 'scale(0.1)',
							opacity: 0,
						}, {
							transform: 'none',
							opacity: 1
						}], {
							duration: 400,
							easing: 'ease-in-out',
							fill: 'forwards',
						});

						el.hidden = false;
					});
				} else {
					each('#main .business-listing', el => el.hidden = false);
				}

				document.getElementById('main').scrollIntoView({ behavior: 'smooth' });
			}
		});

		const datalist = document.getElementById('business-list');

		if (datalist instanceof HTMLElement) {
			const businesses = query('.business-listing[title]');
			const names = Array.from(new Set(businesses.map(({ title }) => title)));
			const opts = names.map(name => {
				const opt = document.createElement('option');
				opt.value = name;
				return opt;
			});

			datalist.append(...opts);
		}
	}
});
