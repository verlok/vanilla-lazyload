import { addClass, removeClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";
import { setStatus } from "./lazyload.data";
import { statusLoaded, statusError } from "./lazyload.elementStatus";
import { deleteTempImage, getTempImage } from "./lazyload.tempImage";
import { unobserve } from "./lazyload.unobserve";

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];
export const hasLoadEvent = (element) => elementsWithLoadEvent.indexOf(element.tagName) > -1;

export const decreaseLoadingCount = (instance) => {
    if (!instance) return;
    instance.loadingCount -= 1;
};

export const checkFinish = (settings, instance) => {
    if (!instance || instance.toLoadCount || instance.loadingCount) return;
    safeCallback(settings.callback_finish, instance);
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
}

export const addEventListeners = (element, loadHandler, errorHandler) => {
    if (!hasEventListeners(element)) element.llEvLisnrs = {};
    addEventListener(element, genericLoadEventName, loadHandler);
    addEventListener(element, errorEventName, errorHandler);
    if (element.tagName !== "VIDEO") return;
    addEventListener(element, mediaLoadEventName, loadHandler);
};

export const removeEventListeners = (element) => {
    if (!hasEventListeners(element)) return;
    const eventListeners = element.llEvLisnrs;
    for (let eventName in eventListeners) {
        const handler = eventListeners[eventName];
        removeEventListener(element, eventName, handler);
    }
    delete element.llEvLisnrs;
};

export const doneHandler = (element, settings, instance) => {
    deleteTempImage(element);
    decreaseLoadingCount(instance);
    removeClass(element, settings.class_loading);
    unobserve(element, settings, instance);
};

export const loadHandler = (event, element, settings, instance) => {
    doneHandler(element, settings, instance);
    addClass(element, settings.class_loaded);
    setStatus(element, statusLoaded);
    safeCallback(settings.callback_loaded, element, instance);
    checkFinish(settings, instance);
};

export const errorHandler = (event, element, settings, instance) => {
    doneHandler(element, settings, instance);
    addClass(element, settings.class_error);
    setStatus(element, statusError);
    safeCallback(settings.callback_error, element, instance);
    checkFinish(settings, instance);
};

export const addOneShotEventListeners = (element, settings, instance) => {
    const elementToListenTo = getTempImage(element) || element;
    if (hasEventListeners(elementToListenTo)) return; // <- when retry loading, e.g. with cancel_on_exit

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
