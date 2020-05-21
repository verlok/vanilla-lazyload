import {
    setSources,
    setBackground,
    setMultiBackground,
    removeDataAttributes,
    manageLoading
} from "./lazyload.setSources";
import { setStatus } from "./lazyload.data";
import { addOneShotEventListeners, checkFinish, hasLoadEvent } from "./lazyload.event";
import { statusNative } from "./lazyload.elementStatus";
import { addTempImage } from "./lazyload.tempImage";

const loadBackground = (element, settings, instance) => {
    addTempImage(element);
    addOneShotEventListeners(element, settings, instance);
    setBackground(element, settings, instance);
    setMultiBackground(element, settings, instance);
};

const loadRegular = (element, settings, instance) => {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
    manageLoading(element, settings, instance);
};

export const load = (element, settings, instance) => {
    if (hasLoadEvent(element)) {
        loadRegular(element, settings, instance);
    } else {
        loadBackground(element, settings, instance);
    }
};

export const loadNative = (element, settings, instance) => {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
    removeDataAttributes(element, settings);
    setStatus(element, statusNative);
};
