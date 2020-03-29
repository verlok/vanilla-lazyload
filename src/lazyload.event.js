import { addClass, removeClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";
import { setStatus } from "./lazyload.data";
import { statusLoaded, statusError } from "./lazyload.elementStatus";

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];

export const hasLoadEvent = element => elementsWithLoadEvent.indexOf(element.tagName) > -1;

export const decreaseLoadingCount = (settings, instance) => {
    if (!instance) return;
    instance.loadingCount -= 1;
    checkFinish(settings, instance);
};

export const checkFinish = (settings, instance) => {
    if (instance.toLoadCount || instance.loadingCount) return;
    safeCallback(settings.callback_finish, instance);
};

export const addEventListener = (element, eventName, handler) => {
    element.addEventListener(eventName, handler);
};

export const removeEventListener = (element, eventName, handler) => {
    element.removeEventListener(eventName, handler);
};

export const addEventListeners = (element, loadHandler, errorHandler) => {
    addEventListener(element, genericLoadEventName, loadHandler);
    addEventListener(element, mediaLoadEventName, loadHandler);
    addEventListener(element, errorEventName, errorHandler);
};

export const removeEventListeners = (element, loadHandler, errorHandler) => {
    removeEventListener(element, genericLoadEventName, loadHandler);
    removeEventListener(element, mediaLoadEventName, loadHandler);
    removeEventListener(element, errorEventName, errorHandler);
};

export const loadHandler = (event, element, settings, instance) => {
    decreaseLoadingCount(settings, instance);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_loaded);
    setStatus(element, statusLoaded);
    safeCallback(settings.callback_loaded, element, instance);
};

export const errorHandler = (event, element, settings, instance) => {
    decreaseLoadingCount(settings, instance);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_error);
    setStatus(element, statusError);
    safeCallback(settings.callback_error, element, instance);
};

export const addOneShotEventListeners = (element, accessoryImg, settings, instance) => {
    const elementToListenTo = accessoryImg || element;

    const _loadHandler = event => {
        loadHandler(event, element, settings, instance);
        removeEventListeners(elementToListenTo, _loadHandler, _errorHandler);
    };
    const _errorHandler = event => {
        errorHandler(event, element, settings, instance);
        removeEventListeners(elementToListenTo, _loadHandler, _errorHandler);
    };

    addEventListeners(elementToListenTo, _loadHandler, _errorHandler);
};
