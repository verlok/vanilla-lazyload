import getInstanceSettings from "./lazyload.defaults";
import { purgeProcessedElements } from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import { revealElement, revealAndUnobserve } from "./lazyload.reveal";
import { setObserver } from "./lazyload.intersectionObserver";
import { isBot, runningOnBrowser } from "./lazyload.environment";

const LazyLoad = function(customSettings, elements) {
	this._settings = getInstanceSettings(customSettings);
	this._loadingCount = 0;
	setObserver(this);
	this.update(elements);
};

LazyLoad.prototype = {
	update: function(elements) {
		const settings = this._settings;
		const _elements =
			elements ||
			settings.container.querySelectorAll(settings.elements_selector);

		this._elements = purgeProcessedElements(
			Array.prototype.slice.call(_elements) // NOTE: nodeset to array for IE compatibility
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
			revealAndUnobserve(element, this);
		});
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
