import { addClass, removeClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";
import { setStatus } from "./lazyload.data";
import { statusLoaded, statusError } from "./lazyload.elementStatus";

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

const eventHandler = function(event, success, settings, instance) {
    const className = success ? settings.class_loaded : settings.class_error;
    const callback = success ? settings.callback_loaded : settings.callback_error;
    const element = event.target;
    const status = success ? statusLoaded : statusError;

    setStatus(element, status);
    removeClass(element, settings.class_loading);
    addClass(element, className);
    safeCallback(callback, element, instance);

    if (!instance) {
        return; // Exit when called from static method
    }

    instance.loadingCount -= 1;

    if (instance.toLoadCount === 0 && instance.loadingCount === 0) {
        safeCallback(settings.callback_finish, instance);
    }
};

export const addOneShotEventListeners = (element, settings, instance) => {
    const loadHandler = event => {
        eventHandler(event, true, settings, instance);
        removeEventListeners(element, loadHandler, errorHandler);
    };
    const errorHandler = event => {
        eventHandler(event, false, settings, instance);
        removeEventListeners(element, loadHandler, errorHandler);
    };
    addEventListeners(element, loadHandler, errorHandler);
};
