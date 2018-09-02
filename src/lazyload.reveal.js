import { setSources } from "./lazyload.setSources";
import { getWasProcessedData, setWasProcessedData } from "./lazyload.data";
import { addOneShotEventListeners } from "./lazyload.event";
import { addClass } from "./lazyload.class";
import { callbackIfSet } from "./lazyload.callback";

const managedTags = ["IMG", "IFRAME", "VIDEO"];

export function revealElement(element, settings, force) {
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	callbackIfSet(settings.callback_enter, element);
	if (managedTags.indexOf(element.tagName) > -1) {
		addOneShotEventListeners(element, settings);
		addClass(element, settings.class_loading);
	}
	setSources(element, settings);
	setWasProcessedData(element);
	callbackIfSet(settings.callback_set, element);
}
