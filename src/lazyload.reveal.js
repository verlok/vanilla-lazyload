import { setSources } from "./lazyload.setSources";
import { getWasProcessedData, setWasProcessedData } from "./lazyload.data";
import { addOneShotEventListeners } from "./lazyload.event";
import { addClass } from "./lazyload.class";
import { safeCallback } from "./lazyload.callback";

const managedTags = ["IMG", "IFRAME", "VIDEO"];

export const revealAndUnobserve = (element, instance) => {
    var observer = instance._observer;
    revealElement(element, instance);
    if (observer && instance._settings.auto_unobserve) {
        observer.unobserve(element);
    }
};

export const revealElement = (element, instance, force) => {
    var settings = instance._settings;
    if (!force && getWasProcessedData(element)) {
        return; // element has already been processed and force wasn't true
    }
    if (managedTags.indexOf(element.tagName) > -1) {
        addOneShotEventListeners(element, instance);
        addClass(element, settings.class_loading);
    }
    setSources(element, instance);
    setWasProcessedData(element);
    safeCallback(settings.callback_reveal, element, instance);
};
