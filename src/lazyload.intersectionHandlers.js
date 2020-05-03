import { delayLoad, cancelDelayLoad } from "./lazyload.delay";
import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { hasStatusAfterLoading, hasStatusObserved } from "./lazyload.data";
import { cancelIfLoading } from "./lazyload.cancelOnExit";

export const onIntersecting = (element, entry, settings, instance) => {
    safeCallback(settings.callback_enter, element, entry, instance);
    if (hasStatusAfterLoading(element)) return; //Prevent loading it again, e.g. on !auto_unobserve
    if (!settings.load_delay) {
        load(element, settings, instance);
        return;
    }
    delayLoad(element, settings, instance);
};

export const onNotIntersecting = (element, entry, settings, instance) => {
    if (hasStatusObserved(element)) return; //Ignore the first pass at landing
    if (settings.cancel_onexit) {
        cancelIfLoading(element, entry, settings, instance);
    }
    safeCallback(settings.callback_exit, element, entry, instance);
    if (!settings.load_delay) return;
    cancelDelayLoad(element);
};
