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
    const loadDelay = settings.load_delay;
    let timeoutId = getTimeoutData(element);
    if (timeoutId) {
        return; // do nothing if timeout already set
    }
    timeoutId = setTimeout(function() {
        load(element, settings, instance);
        cancelDelayLoad(element);
    }, loadDelay);
    setTimeoutData(element, timeoutId);
};
