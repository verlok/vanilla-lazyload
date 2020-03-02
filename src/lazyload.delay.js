import { getTimeoutData, setTimeoutData } from "./lazyload.data";
import { revealAndUnobserve } from "./lazyload.reveal";

export const cancelDelayLoad = element => {
    var timeoutId = getTimeoutData(element);
    if (!timeoutId) {
        return; // do nothing if timeout doesn't exist
    }
    clearTimeout(timeoutId);
    setTimeoutData(element, null);
};

export const delayLoad = (element, instance) => {
    var loadDelay = instance._settings.load_delay;
    var timeoutId = getTimeoutData(element);
    if (timeoutId) {
        return; // do nothing if timeout already set
    }
    timeoutId = setTimeout(function() {
        revealAndUnobserve(element, instance);
        cancelDelayLoad(element);
    }, loadDelay);
    setTimeoutData(element, timeoutId);
};
