import { getTimeoutData, setTimeoutData } from "./lazyload.data";
import { load } from "./lazyload.load";

export const cancelDelayLoad = element => {
    var timeoutId = getTimeoutData(element);
    if (!timeoutId) {
        return; // do nothing if timeout doesn't exist
    }
    clearTimeout(timeoutId);
    setTimeoutData(element, null);
};

export const delayLoad = (element, settings, instance) => {
    var timeoutId = getTimeoutData(element);
    if (timeoutId) {
        return; // do nothing if timeout already set
    }
    timeoutId = setTimeout(function() {
        load(element, settings, instance);
        cancelDelayLoad(element);
    }, settings.load_delay);
    setTimeoutData(element, timeoutId);
};
