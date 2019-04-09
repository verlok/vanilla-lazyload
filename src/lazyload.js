import getInstanceSettings from "./lazyload.defaults";
import { purgeProcessedElements } from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import { revealElement, revealAndUnobserve } from "./lazyload.reveal";
import { setObserver } from "./lazyload.intersectionObserver";
import { isBot, runningOnBrowser } from "./lazyload.environment";
import { shouldUseNative, goNative } from "./lazyload.native";

const nodesetToArray = nodeSet => Array.prototype.slice.call(nodeSet);

const LazyLoad = function(customSettings, elements) {
	const settings = getInstanceSettings(customSettings);
	this._settings = settings;
	this._loadingCount = 0;
	const selectedElements = settings.container.querySelectorAll(
		settings.elements_selector
	);
	this._elements = nodesetToArray(elements || selectedElements);
	if (shouldUseNative(this)) {
		goNative(this);
	} else {
		setObserver(this);
	}
	this.update(elements);
};

LazyLoad.prototype = {
	update: function(elements) {
		const settings = this._settings;
		const selectedElements = settings.container.querySelectorAll(
			settings.elements_selector
		);
		const _elements = nodesetToArray(elements || selectedElements);
		this._elements = purgeProcessedElements(_elements);

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
