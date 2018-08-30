import { setSources } from "./lazyload.setSources";
import {
	setTimeoutData,
	getTimeoutData,
	getWasProcessedData,
	setWasProcessedData
} from "./lazyload.data";
import { addClass, removeClass } from "./lazyload.class";

const managedTags = ["IMG", "IFRAME", "VIDEO"];

const callCallback = (callback, argument) => {
	if (callback) {
		callback(argument);
	}
};

const loadString = "load";
const loadeddataString = "loadeddata";
const errorString = "error";

const addListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
};

const removeListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
};

const addEventListeners = (element, loadHandler, errorHandler) => {
	addListener(element, loadString, loadHandler);
	addListener(element, loadeddataString, loadHandler);
	addListener(element, errorString, errorHandler);
};

const removeListeners = (element, loadHandler, errorHandler) => {
	removeListener(element, loadString, loadHandler);
	removeListener(element, loadeddataString, loadHandler);
	removeListener(element, errorString, errorHandler);
};

const addOneShotListeners = (element, settings) => {
	const loadHandler = event => {
		onEvent(event, true, settings);
		removeListeners(element, loadHandler, errorHandler);
	};
	const errorHandler = event => {
		onEvent(event, false, settings);
		removeListeners(element, loadHandler, errorHandler);
	};
	addEventListeners(element, loadHandler, errorHandler);
};

const onEvent = function(event, success, settings) {
	const element = event.target;
	removeClass(element, settings.class_loading);
	addClass(element, success ? settings.class_loaded : settings.class_error); // Setting loaded or error class
	callCallback(
		success ? settings.callback_load : settings.callback_error,
		element
	);
};

export const loadAndUnobserve = (element, observer, settings) => {
	revealElement(element, settings);
	observer.unobserve(element);
};

export const cancelDelayLoad = element => {
	var timeoutId = getTimeoutData(element);
	if (!timeoutId) {
		return; // do nothing if timeout doesn't exist
	}
	clearTimeout(timeoutId);
	setTimeoutData(element, null);
};

export const delayLoad = (element, observer, settings) => {
	var loadDelay = settings.load_delay;
	var timeoutId = getTimeoutData(element);
	if (timeoutId) {
		return; // do nothing if timeout already set
	}
	timeoutId = setTimeout(function() {
		loadAndUnobserve(element, observer, settings);
		cancelDelayLoad(element);
	}, loadDelay);
	setTimeoutData(element, timeoutId);
};

export function revealElement(element, settings, force) {
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	callCallback(settings.callback_enter, element);
	if (managedTags.indexOf(element.tagName) > -1) {
		addOneShotListeners(element, settings);
		addClass(element, settings.class_loading);
	}
	setSources(element, settings);
	setWasProcessedData(element);
	callCallback(settings.callback_set, element);
}
