import getInstanceSettings from "./lazyload.defaults";
import { purgeProcessedElements } from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
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
import { callbackIfSet } from "./lazyload.callback";

const LazyLoad = function(customSettings, elements) {
	this._settings = getInstanceSettings(customSettings);
	this._setObserver();
	this._loadingCount = 0;
	this.update(elements);
};

LazyLoad.prototype = {
	_manageIntersection: function(entry) {
		var observer = this._observer;
		var loadDelay = this._settings.load_delay;
		var element = entry.target;

		// WITHOUT LOAD DELAY
		if (!loadDelay) {
			if (isIntersecting(entry)) {
				loadAndUnobserve(element, observer, this);
			}
			return;
		}

		// WITH LOAD DELAY
		if (isIntersecting(entry)) {
			delayLoad(element, observer, this);
		} else {
			cancelDelayLoad(element);
		}
	},

	_onIntersection: function(entries) {
		entries.forEach(this._manageIntersection.bind(this));
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

	_updateLoadingCount: function(plusMinus) {
		this._loadingCount += plusMinus;
		if (this._elements.length === 0 && this._loadingCount === 0) {
			callbackIfSet(this._settings.callback_finish);
		}
	},

	update: function(elements) {
		const settings = this._settings;
		const nodeSet =
			elements ||
			settings.container.querySelectorAll(settings.elements_selector);

		this._elements = purgeProcessedElements(
			Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
		);

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
			this._elements.forEach(element => {
				this._observer.unobserve(element);
			});
			this._observer = null;
		}
		this._elements = null;
		this._settings = null;
	},

	load: function(element, force) {
		revealElement(element, this, force);
	},

	loadAll: function() {
		var elements = this._elements;
		elements.forEach(element => {
			this.load(element);
		});
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
