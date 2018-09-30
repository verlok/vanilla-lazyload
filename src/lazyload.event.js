import { addClass, removeClass } from "./lazyload.class";
import { callbackIfSet } from "./lazyload.callback";

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const addEventListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
};

const removeEventListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
};

const addAllEventListeners = (element, loadHandler, errorHandler) => {
	addEventListener(element, genericLoadEventName, loadHandler);
	addEventListener(element, mediaLoadEventName, loadHandler);
	addEventListener(element, errorEventName, errorHandler);
};

const removeAllEventListeners = (element, loadHandler, errorHandler) => {
	removeEventListener(element, genericLoadEventName, loadHandler);
	removeEventListener(element, mediaLoadEventName, loadHandler);
	removeEventListener(element, errorEventName, errorHandler);
};

const eventHandler = function(event, success, settings) {
	const className = success ? settings.class_loaded : settings.class_error;
	const callback = success ? settings.callback_load : settings.callback_error;
	const element = event.target;

	removeClass(element, settings.class_loading);
	addClass(element, className);
	callbackIfSet(callback, element);
};

export const addOneShotEventListeners = (element, settings) => {
	const loadHandler = event => {
		eventHandler(event, true, settings);
		removeAllEventListeners(element, loadHandler, errorHandler);
	};
	const errorHandler = event => {
		eventHandler(event, false, settings);
		removeAllEventListeners(element, loadHandler, errorHandler);
	};
	addAllEventListeners(element, loadHandler, errorHandler);
};
