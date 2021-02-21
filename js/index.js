import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/share-to-button/share-to-button.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/pwa/install.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import 'https://cdn.kernvalley.us/components/app/stores.js';
import 'https://cdn.kernvalley.us/components/business-hours.js';
import { $, ready } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { GA } from './consts.js';

$(':root').css({'--viewport-height': `${window.innerHeight}px`});

requestIdleCallback(() => {
	$(window).debounce('resize', () => $(':root').css({'--viewport-height': `${window.innerHeight}px`}));

	$(window).on('scroll', () => {
		requestAnimationFrame(() => {
			$('#header').css({
				'background-position-y': `${-0.5 * scrollY}px`,
			});
		});
	}, { passive: true });
});

$(document.documentElement).toggleClass({
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

if (typeof GA === 'string' && GA.length !== 0) {
	requestIdleCallback(() => {
		importGa(GA).then(async ({ ga, hasGa }) => {
			if (hasGa()) {
				ga('create', GA, 'auto');
				ga('set', 'transport', 'beacon');
				ga('send', 'pageview');

				await ready();

				$('a[rel~="external"]').click(externalHandler, { passive: true, capture: true });
				$('a[href^="tel:"]').click(telHandler, { passive: true, capture: true });
				$('a[href^="mailto:"]').click(mailtoHandler, { passive: true, capture: true });
			}
		});
	});
}

Promise.allSettled([
	ready(),
]).then(() => {
	init().catch(console.error);

	$('#searchForm').on({
		submit: async event => {
			event.preventDefault();
			const data = new FormData(event.target);
			const name = data.get('name').toLowerCase();

			if (Element.prototype.animate instanceof Function) {
				await $('#main .business-listing[title]').map(el => {
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
				});
			} else {
				$('#main .business-listing[title]').each(el => {
					el.hidden = ! el.title.toLowerCase().includes(name);
				});
				return Promise.resolve();
			}

			const matched = document.querySelector('#main .business-listing:not([hidden])');

			if (matched instanceof HTMLElement) {
				requestAnimationFrame(() => {
					matched.scrollIntoView({ behavior: 'smooth', block: 'end' });
				});
			}
		},
		reset: () => {
			if (Element.prototype.animate instanceof Function) {
				$('#main .business-listing[hidden]').each(el => {
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
				$('#main .business-listing').unhide();
			}

			document.getElementById('main').scrollIntoView({ behavior: 'smooth' });
		}
	});

	const datalist = document.getElementById('business-list');

	if (datalist instanceof HTMLElement) {
		const businesses = Array.from(document.querySelectorAll('.business-listing[title]'));
		const names = Array.from(new Set(businesses.map(({ title }) => title)));
		const opts = names.map(name => {
			const opt = document.createElement('option');
			opt.value = name;
			return opt;
		});

		datalist.append(...opts);
	}
});
