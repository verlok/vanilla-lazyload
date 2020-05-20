import { addClass, removeClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";
import { setStatus, hasStatusNative } from "./lazyload.data";
import { statusLoaded, statusError } from "./lazyload.elementStatus";
import { deleteTempImage, getTempImage } from "./lazyload.tempImage";
import { unobserve } from "./lazyload.unobserve";
import {
    decreaseToLoadCount,
    updateLoadingCount,
    haveElementsToLoad,
    isSomethingLoading
} from "./lazyload.counters";
import { removeDataAttributes } from "./lazyload.setSources";

const elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];
export const hasLoadEvent = (element) => elementsWithLoadEvent.indexOf(element.tagName) > -1;

export const checkFinish = (settings, instance) => {
    if (instance && !isSomethingLoading(instance) && !haveElementsToLoad(instance)) {
        safeCallback(settings.callback_finish, instance);
    }
};

export const addEventListener = (element, eventName, handler) => {
    element.addEventListener(eventName, handler);
    element.llEvLisnrs[eventName] = handler;
};

export const removeEventListener = (element, eventName, handler) => {
    element.removeEventListener(eventName, handler);
};

export const hasEventListeners = (element) => {
    return !!element.llEvLisnrs;
};

export const addEventListeners = (element, loadHandler, errorHandler) => {
    if (!hasEventListeners(element)) element.llEvLisnrs = {};
    const loadEventName = element.tagName === "VIDEO" ? "loadeddata" : "load";
    addEventListener(element, loadEventName, loadHandler);
    addEventListener(element, "error", errorHandler);
};

export const removeEventListeners = (element) => {
    if (!hasEventListeners(element)) {
        return;
    }
    const eventListeners = element.llEvLisnrs;
    for (let eventName in eventListeners) {
        const handler = eventListeners[eventName];
        removeEventListener(element, eventName, handler);
    }
    delete element.llEvLisnrs;
};

export const doneHandler = (element, settings, instance) => {
    deleteTempImage(element);
    updateLoadingCount(instance, -1);
    decreaseToLoadCount(instance);
    removeClass(element, settings.class_loading);
    if (settings.unobserve_completed) {
        unobserve(element, instance);
    }
};

export const loadHandler = (event, element, settings, instance) => {
    const goingNative = hasStatusNative(element);
    doneHandler(element, settings, instance);
    addClass(element, settings.class_loaded);
    setStatus(element, statusLoaded);
    removeDataAttributes(element, settings);
    safeCallback(settings.callback_loaded, element, instance);
    if (!goingNative) checkFinish(settings, instance);
};

export const errorHandler = (event, element, settings, instance) => {
    const goingNative = hasStatusNative(element);
    doneHandler(element, settings, instance);
    addClass(element, settings.class_error);
    setStatus(element, statusError);
    safeCallback(settings.callback_error, element, instance);
    if (!goingNative) checkFinish(settings, instance);
};

export const addOneShotEventListeners = (element, settings, instance) => {
    const elementToListenTo = getTempImage(element) || element;
    if (hasEventListeners(elementToListenTo)) {
        // This happens when loading is retried twice
        return;
    }
    const _loadHandler = (event) => {
        loadHandler(event, element, settings, instance);
        removeEventListeners(elementToListenTo);
    };
    const _errorHandler = (event) => {
        errorHandler(event, element, settings, instance);
        removeEventListeners(elementToListenTo);
    };
    addEventListeners(elementToListenTo, _loadHandler, _errorHandler);
};
