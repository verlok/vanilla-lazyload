import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { hasStatusAfterLoading, hasEmptyStatus, hasStatusLoading } from "./lazyload.data";
import { cancelIfLoading } from "./lazyload.cancelOnExit";
import { unobserve } from "./lazyload.unobserve";

export const onEnter = (element, entry, settings, instance) => {
    safeCallback(settings.callback_enter, element, entry, instance);
    if (hasStatusAfterLoading(element)) {
        return; //Prevent loading it again
    }
    if (settings.unobserve_on_enter) {
        unobserve(element, instance);
    }
    load(element, settings, instance);
};

export const onExit = (element, entry, settings, instance) => {
    if (hasEmptyStatus(element)) {
        return; //Ignore the first pass, at landing
    }
    if (settings.cancel_on_exit && hasStatusLoading(element)) {
        cancelIfLoading(element, entry, settings, instance);
    }
    safeCallback(settings.callback_exit, element, entry, instance);
};
