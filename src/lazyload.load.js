import { setSources } from "./lazyload.setSources";
import { setStatus } from "./lazyload.data";
import { addOneShotEventListeners, checkFinish, hasLoadEvent } from "./lazyload.event";
import { statusNative } from "./lazyload.elementStatus";
import { addClass } from "./lazyload.class";

export const decreaseToLoadCount = (settings, instance) => {
    if (!instance) return;
    instance.toLoadCount -= 1;
    checkFinish(settings, instance);
};

export const unobserve = (element, instance) => {
    if (!instance) return;
    const observer = instance._observer;
    if (observer && instance._settings.auto_unobserve) {
        observer.unobserve(element);
    }
};

export const defineAccessoryImage = element =>
    hasLoadEvent(element) ? null : document.createElement("img");

export const enableLoading = (element, settings, instance) => {
    const accessoryImg = defineAccessoryImage(element);
    addOneShotEventListeners(element, accessoryImg, settings, instance);
    setSources(element, accessoryImg, settings, instance);
    // TODO: MOVE ADDCLASS:LOADING INSIDE SET SOURCES, SO I CAN CREATE CLASS_APPLIED
    addClass(element, settings.class_loading);
    decreaseToLoadCount(settings, instance);
};

export const load = (element, settings, instance) => {
    enableLoading(element, settings, instance);
    unobserve(element, instance);
};

export const loadNative = (element, settings, instance) => {
    enableLoading(element, settings, instance);
    setStatus(element, statusNative);
};
