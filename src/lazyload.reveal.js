import { setSources } from "./lazyload.setSources";
import { callbackIfSet } from "./lazyload.callback";
import { addClass, removeClass } from "./lazyload.class";
import { getWasProcessed } from "./lazyload.data";

export const revealElement = function(element, settings, force) {
	if (!force && getWasProcessed(element)) {
		return;
	}

	const errorCallback = function() {
		/* As this method is asynchronous, it must be protected against external destroy() calls */
		if (!settings) {
			return;
		}
		element.removeEventListener("load", loadCallback);
		element.removeEventListener("error", errorCallback);
		removeClass(element, settings.class_loading);
		addClass(element, settings.class_error);
		callbackIfSet(settings.callback_error, element);
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
		callbackIfSet(settings.callback_load, element);
	};

	callbackIfSet(settings.callback_enter, element);
	if (["IMG", "IFRAME", "VIDEO"].indexOf(element.tagName) > -1) {
		element.addEventListener("load", loadCallback);
		element.addEventListener("error", errorCallback);
		addClass(element, settings.class_loading);
	}
	setSources(element, settings);
	callbackIfSet(settings.callback_set, element);
};
