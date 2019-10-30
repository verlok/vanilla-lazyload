const runningOnBrowser = typeof window !== "undefined";

const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	(typeof navigator !== "undefined" &&
		/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent));

const supportsIntersectionObserver =
	runningOnBrowser && "IntersectionObserver" in window;

const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

const defaultSettings = {
	elements_selector: "img",
	container: isBot || runningOnBrowser ? document : null,
	threshold: 300,
	thresholds: null,
	data_src: "src",
	data_srcset: "srcset",
	data_sizes: "sizes",
	data_bg: "bg",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	load_delay: 0,
	auto_unobserve: true,
	callback_enter: null,
	callback_exit: null,
	callback_reveal: null,
	callback_loaded: null,
	callback_error: null,
	callback_finish: null,
	use_native: false
};

var getInstanceSettings = customSettings => {
	return Object.assign({}, defaultSettings, customSettings);
};

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

const dataPrefix = "data-";
const processedDataName = "was-processed";
const timeoutDataName = "ll-timeout";
const trueString = "true";

const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
	var attrName = dataPrefix + attribute;
	if (value === null) {
		element.removeAttribute(attrName);
		return;
	}
	element.setAttribute(attrName, value);
};

const resetWasProcessedData = element =>
	setData(element, processedDataName, null);

const setWasProcessedData = element =>
	setData(element, processedDataName, trueString);

const getWasProcessedData = element =>
	getData(element, processedDataName) === trueString;

const setTimeoutData = (element, value) =>
	setData(element, timeoutDataName, value);

const getTimeoutData = element => getData(element, timeoutDataName);

const purgeProcessedElements = elements => {
	return elements.filter(element => !getWasProcessedData(element));
};

const purgeOneElement = (elements, elementToPurge) => {
	return elements.filter(element => element !== elementToPurge);
};

const safeCallback = (callback, arg1, arg2, arg3) => {
	if (!callback) {
		return;
	}

	if (arg3 !== undefined) {
		callback(arg1, arg2, arg3);
		return;
	}
	if (arg2 !== undefined) {
		callback(arg1, arg2);
		return;
	}
	callback(arg1);
};

const updateLoadingCount = (instance, plusMinus) => {
	instance._loadingCount += plusMinus;
	if (instance._elements.length === 0 && instance._loadingCount === 0) {
		safeCallback(instance._settings.callback_finish, instance);
	}
};

const getSourceTags = parentTag => {
	let sourceTags = [];
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			sourceTags.push(childTag);
		}
	}
	return sourceTags;
};

const setAttributeIfValue = (element, attrName, value) => {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, value);
};

const setImageAttributes = (element, settings) => {
	setAttributeIfValue(
		element,
		"sizes",
		getData(element, settings.data_sizes)
	);
	setAttributeIfValue(
		element,
		"srcset",
		getData(element, settings.data_srcset)
	);
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

const setSourcesImg = (element, settings) => {
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		let sourceTags = getSourceTags(parent);
		sourceTags.forEach(sourceTag => {
			setImageAttributes(sourceTag, settings);
		});
	}

	setImageAttributes(element, settings);
};

const setSourcesIframe = (element, settings) => {
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

const setSourcesVideo = (element, settings) => {
	let sourceTags = getSourceTags(element);
	sourceTags.forEach(sourceTag => {
		setAttributeIfValue(
			sourceTag,
			"src",
			getData(sourceTag, settings.data_src)
		);
	});
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
	element.load();
};

const setSourcesBgImage = (element, settings) => {
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

	if (srcDataValue) {
		element.style.backgroundImage = `url("${srcDataValue}")`;
	}

	if (bgDataValue) {
		element.style.backgroundImage = bgDataValue;
	}
};

const setSourcesFunctions = {
	IMG: setSourcesImg,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo
};

const setSources = (element, instance) => {
	const settings = instance._settings;
	const tagName = element.tagName;
	const setSourcesFunction = setSourcesFunctions[tagName];
	if (setSourcesFunction) {
		setSourcesFunction(element, settings);
		updateLoadingCount(instance, 1);
		instance._elements = purgeOneElement(instance._elements, element);
		return;
	}
	setSourcesBgImage(element, settings);
};

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

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const addEventListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
};

const removeEventListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
};

const addEventListeners = (element, loadHandler, errorHandler) => {
	addEventListener(element, genericLoadEventName, loadHandler);
	addEventListener(element, mediaLoadEventName, loadHandler);
	addEventListener(element, errorEventName, errorHandler);
};

const removeEventListeners = (element, loadHandler, errorHandler) => {
	removeEventListener(element, genericLoadEventName, loadHandler);
	removeEventListener(element, mediaLoadEventName, loadHandler);
	removeEventListener(element, errorEventName, errorHandler);
};

const eventHandler = function(event, success, instance) {
	var settings = instance._settings;
	const className = success ? settings.class_loaded : settings.class_error;
	const callback = success
		? settings.callback_loaded
		: settings.callback_error;
	const element = event.target;

	removeClass(element, settings.class_loading);
	addClass(element, className);
	safeCallback(callback, element, instance);

	updateLoadingCount(instance, -1);
};

const addOneShotEventListeners = (element, instance) => {
	const loadHandler = event => {
		eventHandler(event, true, instance);
		removeEventListeners(element, loadHandler, errorHandler);
	};
	const errorHandler = event => {
		eventHandler(event, false, instance);
		removeEventListeners(element, loadHandler, errorHandler);
	};
	addEventListeners(element, loadHandler, errorHandler);
};

const managedTags = ["IMG", "IFRAME", "VIDEO"];

const onEnter = (element, entry, instance) => {
	const settings = instance._settings;
	safeCallback(settings.callback_enter, element, entry, instance);
	if (!settings.load_delay) {
		revealAndUnobserve(element, instance);
		return;
	}
	delayLoad(element, instance);
};

const revealAndUnobserve = (element, instance) => {
	var observer = instance._observer;
	revealElement(element, instance);
	if (observer && instance._settings.auto_unobserve) {
		observer.unobserve(element);
	}
};

const onExit = (element, entry, instance) => {
	const settings = instance._settings;
	safeCallback(settings.callback_exit, element, entry, instance);
	if (!settings.load_delay) {
		return;
	}
	cancelDelayLoad(element);
};

const cancelDelayLoad = element => {
	var timeoutId = getTimeoutData(element);
	if (!timeoutId) {
		return; // do nothing if timeout doesn't exist
	}
	clearTimeout(timeoutId);
	setTimeoutData(element, null);
};

const delayLoad = (element, instance) => {
	var loadDelay = instance._settings.load_delay;
	var timeoutId = getTimeoutData(element);
	if (timeoutId) {
		return; // do nothing if timeout already set
	}
	timeoutId = setTimeout(function() {
		revealAndUnobserve(element, instance);
		cancelDelayLoad(element);
	}, loadDelay);
	setTimeoutData(element, timeoutId);
};

const revealElement = (element, instance, force) => {
	var settings = instance._settings;
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	if (managedTags.indexOf(element.tagName) > -1) {
		addOneShotEventListeners(element, instance);
		addClass(element, settings.class_loading);
	}
	setSources(element, instance);
	setWasProcessedData(element);
	safeCallback(settings.callback_reveal, element, instance);
	safeCallback(settings.callback_set, element, instance);
};

const isIntersecting = entry =>
	entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: settings.thresholds || settings.threshold + "px"
});

const setObserver = instance => {
	if (!supportsIntersectionObserver) {
		return false;
	}
	instance._observer = new IntersectionObserver(entries => {
		entries.forEach(entry =>
			isIntersecting(entry)
				? onEnter(entry.target, entry, instance)
				: onExit(entry.target, entry, instance)
		);
	}, getObserverSettings(instance._settings));
	return true;
};

const nativeLazyTags = ["IMG", "IFRAME"];

const shouldUseNative = settings =>
	settings.use_native && "loading" in HTMLImageElement.prototype;

const loadAllNative = instance => {
	instance._elements.forEach(element => {
		if (nativeLazyTags.indexOf(element.tagName) === -1) {
			return;
		}
		element.setAttribute("loading", "lazy");
		revealElement(element, instance);
	});
};

const nodeSetToArray = nodeSet => Array.prototype.slice.call(nodeSet);

const queryElements = settings =>
	settings.container.querySelectorAll(settings.elements_selector);

const getElements = (elements, settings) =>
	purgeProcessedElements(nodeSetToArray(elements || queryElements(settings)));

const retryLazyLoad = instance => {
	var settings = instance._settings;
	var errorElements = settings.container.querySelectorAll(
		"." + settings.class_error
	);
	[...errorElements].forEach(element => {
		removeClass(element, settings.class_error);
		resetWasProcessedData(element);
	});
	instance.update();
};

const setOnlineCheck = instance => {
	if (!runningOnBrowser) {
		return;
	}
	window.addEventListener("online", event => {
		retryLazyLoad(instance);
	});
};

const LazyLoad = function(customSettings, elements) {
	this._settings = getInstanceSettings(customSettings);
	this._loadingCount = 0;
	setObserver(this);
	this.update(elements);
	setOnlineCheck(this);
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
