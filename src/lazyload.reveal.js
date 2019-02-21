import { setSources } from "./lazyload.setSources";
import {
	setTimeoutData,
	getTimeoutData,
	getWasProcessedData,
	setWasProcessedData
} from "./lazyload.data";
import { addOneShotEventListeners } from "./lazyload.event";
import { addClass } from "./lazyload.class";
import { callbackIfSet } from "./lazyload.callback";

const managedTags = ["IMG", "IFRAME", "VIDEO"];

export const onEnter = (element, instance) => {
	callbackIfSet(instance._settings.callback_enter, element);
	if (!settings.load_delay) {
		loadAndUnobserve(element, instance);
		return;
	}
	delayLoad(element, instance);
};

export const onExit = (element, instance) => {
	callbackIfSet(instance._settings.callback_exit, elements);
	if (!settings.load_delay) {
		return;
	}
	cancelDelayLoad(element);
};

export const loadAndUnobserve = (element, instance) => {
	revealElement(element, instance);
	instance._observer.unobserve(element);
};

export const cancelDelayLoad = element => {
	var timeoutId = getTimeoutData(element);
	if (!timeoutId) {
		return; // do nothing if timeout doesn't exist
	}
	clearTimeout(timeoutId);
	setTimeoutData(element, null);
};

export const delayLoad = (element, instance) => {
	var loadDelay = instance._settings.load_delay;
	var timeoutId = getTimeoutData(element);
	if (timeoutId) {
		return; // do nothing if timeout already set
	}
	timeoutId = setTimeout(function() {
		loadAndUnobserve(element, instance);
		cancelDelayLoad(element);
	}, loadDelay);
	setTimeoutData(element, timeoutId);
};

export function revealElement(element, instance, force) {
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
	callbackIfSet(settings.callback_reveal, element);
}
