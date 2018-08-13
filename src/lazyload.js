import getInstanceSettings from "./lazyload.defaults";
import purgeElements from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import revealElement from "./lazyload.reveal";
import {
	isIntersecting,
	getObserverSettings
} from "./lazyload.intersectionObserver";
import {
	isBot,
	runningOnBrowser,
	supportsIntersectionObserver
} from "./lazyload.environment";

const LazyLoad = function(customSettings, elements) {
	this._settings = getInstanceSettings(customSettings);
	this._setObserver();
	this.update(elements);
};

LazyLoad.prototype = {
	_loadObserved: function(entry) {
		let element = entry.target;
		this.load(element);
		this._observer.unobserve(element);
	},
	_manageIntersection: function(entry) {
		var loadDelay = this._settings.load_delay;
		if (isIntersecting(entry)) {
			if (loadDelay === 0) {
				this._loadObserved(entry);
			} else {
				setTimeout(() => {
					// Do something that checks if it's still inside, THEN
					console.log(
						"data-in-viewport at timeout? ",
						entry.target.getAttribute("data-in-viewport")
					);
					if (
						entry.target.getAttribute("data-in-viewport") === "true"
					) {
						this._loadObserved(entry);
					}
				}, loadDelay);
			}
		}

		// Writes in and outs in a data-attribute
		if (isIntersecting(entry)) {
			console.log("Intersecting, write data-in-viewport: true");
			entry.target.setAttribute("data-in-viewport", true);
		} else {
			console.log("No intersecting, write data-in-viewport: false");
			entry.target.setAttribute("data-in-viewport", false);
		}
	},
	_onIntersection: function(entries) {
		entries.forEach(this._manageIntersection.bind(this));
		this._elements = purgeElements(this._elements);
	},
	_setObserver: function() {
		if (!supportsIntersectionObserver) {
			return;
		}
		this._observer = new IntersectionObserver(
			this._onIntersection.bind(this),
			getObserverSettings(this._settings)
		);
	},

	loadAll: function() {
		this._elements.forEach(element => {
			this.load(element);
		});
		this._elements = purgeElements(this._elements);
	},

	update: function(elements) {
		const settings = this._settings;
		const nodeSet =
			elements ||
			settings.container.querySelectorAll(settings.elements_selector);

		this._elements = purgeElements(Array.prototype.slice.call(nodeSet)); // nodeset to array for IE compatibility

		if (isBot || !this._observer) {
			this.loadAll();
			return;
		}

		this._elements.forEach(element => {
			this._observer.observe(element);
		});
	},

	destroy: function() {
		if (this._observer) {
			purgeElements(this._elements).forEach(element => {
				this._observer.unobserve(element);
			});
			this._observer = null;
		}
		this._elements = null;
		this._settings = null;
	},

	load: function(element, force) {
		revealElement(element, this._settings, force);
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
