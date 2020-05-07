import {
    getTimeoutData,
    setTimeoutData,
    setStatus,
    resetStatus,
    hasStatusDelayed
} from "./lazyload.data";
import { load } from "./lazyload.load";
import { statusDelayed } from "./lazyload.elementStatus";

export const cancelDelayLoad = (element) => {
    var timeoutId = getTimeoutData(element);
    if (!timeoutId) {
        return; // do nothing if timeout doesn't exist
    }
    if (hasStatusDelayed(element)) { // iffing because status could also be "loading"
        resetStatus(element); 
    }
    clearTimeout(timeoutId);
    setTimeoutData(element, null);
};

export const delayLoad = (element, settings, instance) => {
    const loadDelay = settings.load_delay;
    let timeoutId = getTimeoutData(element);
    if (timeoutId) {
        return; // do nothing if timeout already set
    }
    timeoutId = setTimeout(function () {
        load(element, settings, instance);
        cancelDelayLoad(element);
    }, loadDelay);
    setStatus(element, statusDelayed);
    setTimeoutData(element, timeoutId);
};
