import { addClass, removeClass } from "./lazyload.class";
import { callbackIfSet } from "./lazyload.callback";
import { updateLoadingCount } from "./lazyload.loadingCount";

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
	callbackIfSet(callback, element);

	updateLoadingCount(instance, -1);
};

export const addOneShotEventListeners = (element, instance) => {
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
