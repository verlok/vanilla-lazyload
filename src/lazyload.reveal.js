import { setSources } from "./lazyload.setSources";
import {
	setTimeoutData,
	getTimeoutData,
	getWasProcessedData,
	setWasProcessedData
} from "./lazyload.data";
import { addOneShotEventListeners } from "./lazyload.event";
import { addClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";

const managedTags = ["IMG", "IFRAME", "VIDEO"];

export const onEnter = (element, entry, instance) => {
	const settings = instance._settings;
	safeCallback(settings.callback_enter, element, entry, instance);
	if (!settings.load_delay) {
		revealAndUnobserve(element, instance);
		return;
	}
	delayLoad(element, instance);
};

export const revealAndUnobserve = (element, instance) => {
	var observer = instance._observer;
	revealElement(element, instance);
	if (observer && instance._settings.auto_unobserve) {
		observer.unobserve(element);
	}
};

export const onExit = (element, entry, instance) => {
	const settings = instance._settings;
	safeCallback(settings.callback_exit, element, entry, instance);
	if (!settings.load_delay) {
		return;
	}
	cancelDelayLoad(element);
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
		revealAndUnobserve(element, instance);
		cancelDelayLoad(element);
	}, loadDelay);
	setTimeoutData(element, timeoutId);
};

export const revealElement = (element, instance, force) => {
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
