import { delayLoad, cancelDelayLoad } from "./lazyload.delay";
import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { hasStatusAfterLoading, hasStatusObserved } from "./lazyload.data";

export const onIntersecting = (element, entry, settings, instance) => {
    safeCallback(settings.callback_enter, element, entry, instance);
    if (hasStatusAfterLoading(element)) return; //Prevent loading again when auto_unobserve is false
    if (!settings.load_delay) {
        load(element, settings, instance);
        return;
    }
    delayLoad(element, settings, instance);
};

export const onNotIntersecting = (element, entry, settings, instance) => {
    if (hasStatusObserved(element)) return; //Ignore the first pass at landing
    safeCallback(settings.callback_exit, element, entry, instance);
    if (!settings.load_delay) return;
    cancelDelayLoad(element);
};
