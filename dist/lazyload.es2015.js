(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LazyLoad = factory());
}(this, (function () { 'use strict';

var getDefaultSettings = () => ({
	elements_selector: "img",
	container: window,
	threshold: 300,
	throttle: 150,
	data_src: "src",
	data_srcset: "srcset",
	data_sizes: "sizes",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	class_initial: "initial",
	skip_invisible: true,
	callback_load: null,
	callback_error: null,
	callback_set: null,
	callback_processed: null,
	callback_enter: null
});

const isBot = !("onscroll" in window) || /glebot/.test(navigator.userAgent);

const callCallback = function (callback, argument) {
    if (callback) { callback(argument); }
};

const getTopOffset = function(element) {
	return (
		element.getBoundingClientRect().top +
		window.pageYOffset -
		element.ownerDocument.documentElement.clientTop
	);
};

const isBelowViewport = function(element, container, threshold) {
	const fold =
		container === window
			? window.innerHeight + window.pageYOffset
			: getTopOffset(container) + container.offsetHeight;
	return fold <= getTopOffset(element) - threshold;
};

const getLeftOffset = function(element) {
	return (
		element.getBoundingClientRect().left +
		window.pageXOffset -
		element.ownerDocument.documentElement.clientLeft
	);
};

const isAtRightOfViewport = function(element, container, threshold) {
	const documentWidth = window.innerWidth;
	const fold =
		container === window
			? documentWidth + window.pageXOffset
			: getLeftOffset(container) + documentWidth;
	return fold <= getLeftOffset(element) - threshold;
};

const isAboveViewport = function(element, container, threshold) {
	const fold =
		container === window ? window.pageYOffset : getTopOffset(container);
	return fold >= getTopOffset(element) + threshold + element.offsetHeight;
};

const isAtLeftOfViewport = function(element, container, threshold) {
	const fold =
		container === window ? window.pageXOffset : getLeftOffset(container);
	return fold >= getLeftOffset(element) + threshold + element.offsetWidth;
};

function isInsideViewport(element, container, threshold) {
	return (
		!isBelowViewport(element, container, threshold) &&
		!isAboveViewport(element, container, threshold) &&
		!isAtRightOfViewport(element, container, threshold) &&
		!isAtLeftOfViewport(element, container, threshold)
	);
}

/* Creates instance and notifies it through the window element */
const createInstance = function (classObj, options) { 
    var event;
    let eventString = "LazyLoad::Initialized";
    let instance = new classObj(options);
    try {
        // Works in modern browsers
        event = new CustomEvent(eventString, { detail: { instance } });
    } 
    catch(err) {
        // Works in Internet Explorer (all versions)
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventString, false, false, { instance });
    }
    window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
function autoInitialize (classObj, options) { 
    let optsLength = options.length;
    if (!optsLength) {
        // Plain object
        createInstance(classObj, options);
    }
    else {
        // Array of objects
        for (let i = 0; i < optsLength; i++) {
            createInstance(classObj, options[i]);
        }
    }
}

const dataPrefix = "data-";
const processedDataName = "was-processed";
const processedDataValue = "true";

const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
	return element.setAttribute(dataPrefix + attribute, value);
};

const setWasProcessed = element =>
	setData(element, processedDataName, processedDataValue);

const getWasProcessed = element =>
	getData(element, processedDataName) === processedDataValue;

const setSourcesInChildren = function(parentTag, attrName, dataAttrName) {
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			let attributeValue = getData(childTag, dataAttrName);
			if (attributeValue) {
				childTag.setAttribute(attrName, attributeValue);
			}
		}
	}
};

const setAttributeIfNotNullOrEmpty = function(element, attrName, value) {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, value);
};

function setSources(element, settings) {
	const {
		data_sizes: sizesDataName,
		data_srcset: srcsetDataName,
		data_src: srcDataName
	} = settings;
	const srcDataValue = getData(element, srcDataName);
	const tagName = element.tagName;
	if (tagName === "IMG") {
		const parent = element.parentNode;
		if (parent && parent.tagName === "PICTURE") {
			setSourcesInChildren(parent, "srcset", srcsetDataName);
		}
		const sizesDataValue = getData(element, sizesDataName);
		setAttributeIfNotNullOrEmpty(element, "sizes", sizesDataValue);
		const srcsetDataValue = getData(element, srcsetDataName);
		setAttributeIfNotNullOrEmpty(element, "srcset", srcsetDataValue);
		setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
		return;
	}
	if (tagName === "IFRAME") {
		setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
		return;
	}
	if (tagName === "VIDEO") {
		setSourcesInChildren(element, "src", srcDataName);
		setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
		return;
	}
	if (srcDataValue) {
		element.style.backgroundImage = `url("${srcDataValue}")`;
	}
}

const runningOnBrowser = (typeof window !== "undefined");

const supportsClassList = runningOnBrowser && ("classList" in document.createElement("p"));

const addClass = (element, className) => {
    if (supportsClassList) {
        element.classList.add(className);
        return;
    }
    element.className += (element.className ? " " : "") + className;
};

const removeClass = (element, className) => {
    if (supportsClassList) {
        element.classList.remove(className);
        return;
    }
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
};

/*
 * Constructor
 */

const LazyLoad = function(instanceSettings) {
	this._settings = Object.assign({}, getDefaultSettings(), instanceSettings);
	this._queryOriginNode =
		this._settings.container === window
			? document
			: this._settings.container;

	this._previousLoopTime = 0;
	this._loopTimeout = null;
	this._boundHandleScroll = this.handleScroll.bind(this);

	this._isFirstLoop = true;
	window.addEventListener("resize", this._boundHandleScroll);
	this.update();
};

LazyLoad.prototype = {
	_reveal: function(element, force) {
		if (!force && getWasProcessed(element)) {
			return; // element has already been processed and force wasn't true
		}

		const settings = this._settings;

		const errorCallback = function() {
			/* As this method is asynchronous, it must be protected against external destroy() calls */
			if (!settings) {
				return;
			}
			element.removeEventListener("load", loadCallback);
			element.removeEventListener("error", errorCallback);
			removeClass(element, settings.class_loading);
			addClass(element, settings.class_error);
			callCallback(settings.callback_error, element);
		};

		const loadCallback = function() {
			/* As this method is asynchronous, it must be protected against external destroy() calls */
			if (!settings) {
				return;
			}
			removeClass(element, settings.class_loading);
			addClass(element, settings.class_loaded);
			element.removeEventListener("load", loadCallback);
			element.removeEventListener("error", errorCallback);
			callCallback(settings.callback_load, element);
		};

		callCallback(settings.callback_enter, element);
		if (["IMG", "IFRAME", "VIDEO"].indexOf(element.tagName) > -1) {
			element.addEventListener("load", loadCallback);
			element.addEventListener("error", errorCallback);
			addClass(element, settings.class_loading);
		}
		setSources(element, settings);
		callCallback(settings.callback_set, element);
	},

	_loopThroughElements: function(forceDownload) {
		const settings = this._settings,
			elements = this._elements,
			elementsLength = !elements ? 0 : elements.length;
		let i,
			processedIndexes = [],
			firstLoop = this._isFirstLoop;

		for (i = 0; i < elementsLength; i++) {
			let element = elements[i];
			/* If must skip_invisible and element is invisible, skip it */
			if (settings.skip_invisible && element.offsetParent === null) {
				continue;
			}

			if (
				isBot ||
				forceDownload ||
				isInsideViewport(
					element,
					settings.container,
					settings.threshold
				)
			) {
				if (firstLoop) {
					addClass(element, settings.class_initial);
				}
				/* Start loading the image */
				this.load(element);
				/* Marking the element as processed. */
				processedIndexes.push(i);
				setWasProcessed(element);
			}
		}
		/* Removing processed elements from this._elements. */
		while (processedIndexes.length) {
			elements.splice(processedIndexes.pop(), 1);
			callCallback(settings.callback_processed, elements.length);
		}
		/* Stop listening to scroll event when 0 elements remains */
		if (elementsLength === 0) {
			this._stopScrollHandler();
		}
		/* Sets isFirstLoop to false */
		if (firstLoop) {
			this._isFirstLoop = false;
		}
	},

	_purgeElements: function() {
		const elements = this._elements,
			elementsLength = elements.length;
		let i,
			elementsToPurge = [];

		for (i = 0; i < elementsLength; i++) {
			let element = elements[i];
			/* If the element has already been processed, skip it */
			if (getWasProcessed(element)) {
				elementsToPurge.push(i);
			}
		}
		/* Removing elements to purge from this._elements. */
		while (elementsToPurge.length > 0) {
			elements.splice(elementsToPurge.pop(), 1);
		}
	},

	_startScrollHandler: function() {
		if (!this._isHandlingScroll) {
			this._isHandlingScroll = true;
			this._settings.container.addEventListener(
				"scroll",
				this._boundHandleScroll
			);
		}
	},

	_stopScrollHandler: function() {
		if (this._isHandlingScroll) {
			this._isHandlingScroll = false;
			this._settings.container.removeEventListener(
				"scroll",
				this._boundHandleScroll
			);
		}
	},

	handleScroll: function() {
		const throttle = this._settings.throttle;

		if (throttle !== 0) {
			let now = Date.now();
			let remainingTime = throttle - (now - this._previousLoopTime);
			if (remainingTime <= 0 || remainingTime > throttle) {
				if (this._loopTimeout) {
					clearTimeout(this._loopTimeout);
					this._loopTimeout = null;
				}
				this._previousLoopTime = now;
				this._loopThroughElements();
			} else if (!this._loopTimeout) {
				this._loopTimeout = setTimeout(
					function() {
						this._previousLoopTime = Date.now();
						this._loopTimeout = null;
						this._loopThroughElements();
					}.bind(this),
					remainingTime
				);
			}
		} else {
			this._loopThroughElements();
		}
	},

	loadAll: function() {
		this._loopThroughElements(true);
	},

	update: function() {
		// Converts to array the nodeset obtained querying the DOM from _queryOriginNode with elements_selector
		this._elements = Array.prototype.slice.call(
			this._queryOriginNode.querySelectorAll(
				this._settings.elements_selector
			)
		);
		this._purgeElements();
		this._loopThroughElements();
		this._startScrollHandler();
	},

	destroy: function() {
		window.removeEventListener("resize", this._boundHandleScroll);
		if (this._loopTimeout) {
			clearTimeout(this._loopTimeout);
			this._loopTimeout = null;
		}
		this._stopScrollHandler();
		this._elements = null;
		this._queryOriginNode = null;
		this._settings = null;
	},

	load: function(element, force) {
		this._reveal(element, force);
	}
};

/* Automatic instances creation if required (useful for async script loading!) */
let autoInitOptions = window.lazyLoadOptions;
if (runningOnBrowser && autoInitOptions) {
	autoInitialize(LazyLoad, autoInitOptions);
}

return LazyLoad;

})));
