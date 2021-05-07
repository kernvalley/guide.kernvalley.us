import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/share-to-button/share-to-button.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/install/prompt.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import 'https://cdn.kernvalley.us/components/app/stores.js';
import 'https://cdn.kernvalley.us/components/business-hours.js';
import { ready, loaded, query, on, css, toggleClass, each, map } from 'https://cdn.kernvalley.us/js/std-js/dom.js';
import { debounce } from 'https://cdn.kernvalley.us/js/std-js/events.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { GA } from './consts.js';
import { installPrompt } from './functions.js';

css([document.documentElement], { '--viewport-height': `${window.innerHeight}px` });

on([window], {
	resize: () => debounce(() => css([document.documentElement], { '--viewport-height': `${window.innerHeight}px` })),
	scroll: ({ scrollY }) => css('#header', { 'backgroound-position-y': `${-0.5 * scrollY}px` }),
}, { passive: true });

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

ready().then(() => {
	init();

	customElements.whenDefined('install-prompt').then(() => {
		on('#install-btn', 'click', () => installPrompt()).forEach(btn => btn.hidden = false);
	});

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
});
