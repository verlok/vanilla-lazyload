import getInstanceSettings from "./lazyload.defaults";
import purgeElements from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import revealElement from "./lazyload.reveal";
import { getInViewport, setInViewport } from "./lazyload.data";
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
	_loadObserved: function(element) {
		this.load(element);
		this._observer.unobserve(element);
	},
	_delayLoad: function(element, loadDelay) {
		setTimeout(() => {
			if (getInViewport(element)) {
				this._loadObserved(element);
			}
		}, loadDelay);
	},
	_manageIntersection: function(entry) {
		var loadDelay = this._settings.load_delay;
		var element = entry.target;
		if (isIntersecting(entry)) {
			if (loadDelay === 0) {
				this._loadObserved(element);
			} else {
				this._delayLoad(element, loadDelay);
			}
		}

		// Writes in and outs in a data-attribute
		if (isIntersecting(entry)) {
			setInViewport(element);
		} else {
			setInViewport(element, false);
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
