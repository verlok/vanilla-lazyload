import { addClass, removeClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";
import { setStatus } from "./lazyload.data";
import { statusLoaded, statusError } from "./lazyload.elementStatus";

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const decreaseLoadingCount = (settings, instance) => {
    instance.loadingCount -= 1;
    checkFinish(settings, instance);
};

export const checkFinish = (settings, instance) => {
    if (instance.toLoadCount || instance.loadingCount) return;
    safeCallback(settings.callback_finish, instance);
};

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

const loadHandler = (event, settings, instance) => {
    const element = event.target;
    setStatus(element, statusLoaded);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_loaded);
    safeCallback(settings.callback_loaded, element, instance);
    if (instance) decreaseLoadingCount(settings, instance);
};

const errorHandler = (event, settings, instance) => {
    const element = event.target;
    setStatus(element, statusError);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_error);
    safeCallback(settings.callback_error, element, instance);
    if (instance) decreaseLoadingCount(settings, instance);
};

export const addOneShotEventListeners = (element, settings, instance) => {
    const _loadHandler = event => {
        loadHandler(event, settings, instance);
        removeEventListeners(element, _loadHandler, _errorHandler);
    };
    const _errorHandler = event => {
        errorHandler(event, settings, instance);
        removeEventListeners(element, _loadHandler, _errorHandler);
    };
    addEventListeners(element, _loadHandler, _errorHandler);
};
