import { setSources } from "./lazyload.setSources";
import { setStatus } from "./lazyload.data";
import { addOneShotEventListeners } from "./lazyload.event";
import { addClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";
import { statusLoading, statusNative } from "./lazyload.elementStatus";

const manageableTags = ["IMG", "IFRAME", "VIDEO"];

export const unobserve = (element, instance) => {
    // Unobserve
    const observer = instance._observer;
    if (observer && instance._settings.auto_unobserve) {
        observer.unobserve(element);
    }
};

export const isManageableTag = element => manageableTags.indexOf(element.tagName) > -1;

export const load = (element, settings, instance) => {
    if (isManageableTag(element)) {
        addOneShotEventListeners(element, settings, instance);
        addClass(element, settings.class_loading);
    }
    setSources(element, settings, instance);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
    /* DEPRECATED, REMOVE IN V.15 => */ safeCallback(settings.callback_reveal, element, instance);
    if (!instance) {
        return; // Exit when called from static method
    }
    unobserve(element, instance);
};

export const loadNative = (element, instance) => {
    const settings = instance._settings;
    if (isManageableTag(element)) {
        addOneShotEventListeners(element, settings, instance);
        addClass(element, settings.class_loading);
    }
    setSources(element, instance);
    setStatus(element, statusNative);
    unobserve(element, instance);
};
