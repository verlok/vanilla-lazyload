(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined"
		? (module.exports = factory())
		: typeof define === "function" && define.amd
			? define(factory)
			: (global.LazyLoad = factory());
}(this, function() {
	"use strict";

	var getInstanceSettings = customSettings => {
		const defaultSettings = {
			elements_selector: "img",
			container: document,
			threshold: 300,
			data_src: "src",
			data_srcset: "srcset",
			data_sizes: "sizes",
			class_loading: "loading",
			class_loaded: "loaded",
			class_error: "error",
			callback_load: null,
			callback_error: null,
			callback_set: null,
			callback_enter: null
		};

		return Object.assign({}, defaultSettings, customSettings);
	};

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

	function purgeElements(elements) {
		return elements.filter(element => !getWasProcessed(element));
	}

	/* Creates instance and notifies it through the window element */
	const createInstance = function(classObj, options) {
		var event;
		let eventString = "LazyLoad::Initialized";
		let instance = new classObj(options);
		try {
			// Works in modern browsers
			event = new CustomEvent(eventString, { detail: { instance } });
		} catch (err) {
			// Works in Internet Explorer (all versions)
			event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventString, false, false, { instance });
		}
		window.dispatchEvent(event);
	};

	/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
	function autoInitialize(classObj, options) {
		if (!options) {
			return;
		}
		if (!options.length) {
			// Plain object
			createInstance(classObj, options);
		} else {
			// Array of objects
			for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
				createInstance(classObj, optionsItem);
			}
		}
	}

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

	const setSources = function(element, settings) {
		const {
			data_sizes: sizesDataName,
			data_srcset: srcsetDataName,
			data_src: srcDataName
		} = settings;
		const srcDataValue = getData(element, srcDataName);
		switch (element.tagName) {
			case "IMG": {
				const parent = element.parentNode;
				if (parent && parent.tagName === "PICTURE") {
					setSourcesInChildren(parent, "srcset", srcsetDataName);
				}
				const sizesDataValue = getData(element, sizesDataName);
				setAttributeIfNotNullOrEmpty(element, "sizes", sizesDataValue);
				const srcsetDataValue = getData(element, srcsetDataName);
				setAttributeIfNotNullOrEmpty(
					element,
					"srcset",
					srcsetDataValue
				);
				setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
				break;
			}
			case "IFRAME":
				setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
				break;
			case "VIDEO":
				setSourcesInChildren(element, "src", srcDataName);
				setAttributeIfNotNullOrEmpty(element, "src", srcDataValue);
				break;
			default:
				if (srcDataValue) {
					element.style.backgroundImage = `url("${srcDataValue}")`;
				}
		}
	};

	const runningOnBrowser = typeof window !== "undefined";

	const isBot =
		(runningOnBrowser && !("onscroll" in window)) ||
		/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

	const supportsIntersectionObserver =
		runningOnBrowser && "IntersectionObserver" in window;

	const supportsClassList =
		runningOnBrowser && "classList" in document.createElement("p");

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
		element.className = element.className.
			replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").
			replace(/^\s+/, "").
			replace(/\s+$/, "");
	};

	const callCallback = function(callback, argument) {
		if (callback) {
			callback(argument);
		}
	};

	const loadString = "load";
	const errorString = "error";

	const removeListeners = function(element, loadHandler, errorHandler) {
		element.removeEventListener(loadString, loadHandler);
		element.removeEventListener(errorString, errorHandler);
	};

	const addOneShotListeners = function(element, settings) {
		const onLoad = event => {
			onEvent(event, true, settings);
			removeListeners(element, onLoad, onError);
		};
		const onError = event => {
			onEvent(event, false, settings);
			removeListeners(element, onLoad, onError);
		};
		element.addEventListener(loadString, onLoad);
		element.addEventListener(errorString, onError);
	};

	const onEvent = function(event, success, settings) {
		const element = event.target;
		removeClass(element, settings.class_loading);
		addClass(
			element,
			success ? settings.class_loaded : settings.class_error
		); // Setting loaded or error class
		callCallback(
			success ? settings.callback_load : settings.callback_error,
			element
		);
	};

	function revealElement(element, settings, force) {
		if (!force && getWasProcessed(element)) {
			return; // element has already been processed and force wasn't true
		}
		callCallback(settings.callback_enter, element);
		if (["IMG", "IFRAME", "VIDEO"].indexOf(element.tagName) > -1) {
			addOneShotListeners(element, settings);
			addClass(element, settings.class_loading);
		}
		setSources(element, settings);
		setWasProcessed(element);
		callCallback(settings.callback_set, element);
	}

	/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
	const isIntersecting = element =>
		element.isIntersecting || element.intersectionRatio > 0;

	const getObserverSettings = settings => ({
		root: settings.container === document ? null : settings.container,
		rootMargin: settings.threshold + "px"
	});

	const LazyLoad = function(customSettings, elements) {
		this._settings = getInstanceSettings(customSettings);
		this._setObserver();
		this.update(elements);
	};

	LazyLoad.prototype = {
		_setObserver: function() {
			if (!supportsIntersectionObserver) {
				return;
			}
			const revealIntersectingElements = entries => {
				entries.forEach(entry => {
					if (isIntersecting(entry)) {
						let element = entry.target;
						this.load(element);
						this._observer.unobserve(element);
					}
				});
				this._elements = purgeElements(this._elements);
			};
			this._observer = new IntersectionObserver(
				revealIntersectingElements,
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

	return LazyLoad;
}));
