import { setSources } from "./lazyload.setSources";
import { setStatus } from "./lazyload.data";
import { addOneShotEventListeners } from "./lazyload.event";
import { addClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";
import { statusLoading, statusNative } from "./lazyload.elementStatus";

const manageableTags = ["IMG", "IFRAME", "VIDEO"];

export const checkFinish = (settings, instance) => {
    if (instance.toLoadCount || instance.loadingCount) return;
    safeCallback(settings.callback_finish, instance);
};

export const decreaseToLoadCount = (settings, instance) => {
    if (instance) instance.toLoadCount -= 1;
    checkFinish(settings, instance);
};

export const unobserve = (element, instance) => {
    const observer = instance._observer;
    if (observer && instance._settings.auto_unobserve) {
        observer.unobserve(element);
    }
};

export const isManageableTag = element => manageableTags.indexOf(element.tagName) > -1;

export const enableLoading = (element, settings, instance) => {
    if (isManageableTag(element)) {
        addOneShotEventListeners(element, settings, instance);
        addClass(element, settings.class_loading);
    }
    setSources(element, settings, instance);
    decreaseToLoadCount(settings, instance);
};

export const load = (element, settings, instance) => {
    enableLoading(element, settings, instance);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
    /* DEPRECATED, REMOVE IN V.15 => */ safeCallback(settings.callback_reveal, element, instance);
    if (instance) unobserve(element, instance);
};

export const loadNative = (element, settings, instance) => {
    enableLoading(element, settings, instance);
    setStatus(element, statusNative);
};
