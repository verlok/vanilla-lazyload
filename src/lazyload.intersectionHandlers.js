import { delayLoad, cancelDelayLoad } from "./lazyload.delay";
import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { hasStatusAfterLoading, hasStatusObserved, hasStatusLoading } from "./lazyload.data";

export const cancelIfLoading = (element, entry, settings, instance) => {
    if (hasStatusLoading(element)) {
        safeCallback(settings.callback_cancel, element, entry, instance);
        // setTimeout is needed because the "callback_cancel" implementation
        // could be out of the main thread, e.g. `img.setAttribute("src", "")`
        setTimeout(() => {
            instance.resetElement(element);
        }, 0);
    }
};

export const onIntersecting = (element, entry, settings, instance) => {
    safeCallback(settings.callback_enter, element, entry, instance);
    if (hasStatusAfterLoading(element)) return; //Prevent loading it again, e.g. on !auto_unobserve or cancel_onexit
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
