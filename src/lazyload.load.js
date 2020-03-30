import {
    setSources,
    setBackgroundFromDataSrc,
    setBackgroundFromDataBg
} from "./lazyload.setSources";
import { setStatus } from "./lazyload.data";
import { addOneShotEventListeners, checkFinish, hasLoadEvent } from "./lazyload.event";
import { statusNative } from "./lazyload.elementStatus";
import { addTempImage } from "./lazyload.tempImage";

export const decreaseToLoadCount = (settings, instance) => {
    if (!instance) return;
    instance.toLoadCount -= 1;
};

export const unobserve = (element, instance) => {
    if (!instance) return;
    const observer = instance._observer;
    if (observer && instance._settings.auto_unobserve) {
        observer.unobserve(element);
    }
};

const loadWithTempImage = (element, settings, instance) => {
    addTempImage(element);
    addOneShotEventListeners(element, settings, instance);
    setBackgroundFromDataSrc(element, settings, instance);
    setBackgroundFromDataBg(element, settings, instance);
};

const loadRegular = (element, settings, instance) => {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
};

export const load = (element, settings, instance) => {
    if (hasLoadEvent(element)) {
        loadRegular(element, settings, instance);
    } else {
        loadWithTempImage(element, settings, instance);
    }
    decreaseToLoadCount(settings, instance);
    unobserve(element, instance);
    checkFinish(settings, instance);
};

export const loadNative = (element, settings, instance) => {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
    decreaseToLoadCount(settings, instance);
    setStatus(element, statusNative);
    checkFinish(settings, instance);
};
