import getInstanceSettings from "./lazyload.defaults";
import autoInitialize from "./lazyload.autoInitialize";
import { revealElement, revealAndUnobserve } from "./lazyload.reveal";
import { setObserver } from "./lazyload.intersectionObserver";
import { isBot, runningOnBrowser } from "./lazyload.environment";
import { shouldUseNative, loadAllNative } from "./lazyload.native";
import { getElements } from "./lazyload.getElements";

const LazyLoad = function(customSettings, elements) {
	this._settings = getInstanceSettings(customSettings);
	this._loadingCount = 0;
	setObserver(this);
	this.update(elements);
};

LazyLoad.prototype = {
	update: function(elements) {
		var settings = this._settings;
		this._elements = getElements(elements, settings);
		if (isBot || !this._observer) {
			this.loadAll();
			return;
		}
		if (shouldUseNative(settings)) {
			loadAllNative(this);
			this._elements = getElements(elements, settings);
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
		this._elements.forEach(element => {
			revealAndUnobserve(element, this);
		});
	}
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
	autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
