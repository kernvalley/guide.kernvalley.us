import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/krv/events.js';
import 'https://cdn.kernvalley.us/components/share-to-button/share-to-button.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/install/prompt.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import 'https://cdn.kernvalley.us/components/app/stores.js';
import 'https://cdn.kernvalley.us/components/business-hours.js';
import { DAYS } from 'https://cdn.kernvalley.us/js/std-js/date-consts.js';
import { prefersReducedMotion } from 'https://cdn.kernvalley.us/js/std-js/media-queries.js';
import { ready, loaded, query, on, toggleClass, each, map, addClass, intersect } from 'https://cdn.kernvalley.us/js/std-js/dom.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { GA } from './consts.js';
import { installPrompt } from './functions.js';

toggleClass([document.documentElement], {
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

if (typeof GA === 'string' && GA.length !== 0) {
	loaded().then(() => {
		requestIdleCallback(async () => {
			const { ga, hasGa } = await importGa(GA);

			if (hasGa()) {
				ga('create', GA, 'auto');
				ga('set', 'transport', 'beacon');
				ga('send', 'pageview');

				on('a[rel~="external"]', 'click', externalHandler, { passive: true, capture: true });
				on('a[href^="tel:"]', 'click', telHandler, { passive: true, capture: true });
				on('a[href^="mailto:"]', 'click', mailtoHandler, { passive: true, capture: true });
			}
		});
	});
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

		on('#searchForm', {
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
