import getInstanceSettings from "./lazyload.defaults";
import purgeElements from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import { addOneShotPromiseEventListners } from "./lazyload.event";
import {
	revealElement,
	loadAndUnobserve,
	delayLoad,
	cancelDelayLoad
} from "./lazyload.reveal";
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
	_manageIntersection: function(entry) {
		var observer = this._observer;
		var settings = this._settings;
		var loadDelay = this._settings.load_delay;
		var element = entry.target;
		if (isIntersecting(entry)) {
			if (!loadDelay) {
				loadAndUnobserve(element, observer, settings);
			} else {
				delayLoad(element, observer, settings);
			}
		}

		// Writes in and outs in a data-attribute
		if (!isIntersecting(entry)) {
			cancelDelayLoad(element);
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
	},

	loadAll: function() {
		const elements = this._elements;
		elements.forEach(element => {
			this.load(element);
		});
		this._elements = purgeElements(elements);
	},

	loadPromise: function(element, force) {
		return new Promise((resolve, reject) => {
			addOneShotPromiseEventListners(element, resolve, reject);
			this.load(element, force);
		});
	},

	loadAllPromise: function() {
		return new Promise((resolve, reject) => {
			const loadPromises = this._elements.map(element => {
				return this.loadPromise(element);
			});
			Promise.all(loadPromises).
				then(elements => {
					resolve(elements);
				}).
				catch(error => {
					reject(error);
				});
		});
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
