import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { hasEmptyStatus } from "./lazyload.data";
import { checkIfMustCancelLoading } from "./lazyload.cancelOnExit";
import { unobserve } from "./lazyload.unobserve";

export const onEnter = (element, entry, settings, instance) => {
    safeCallback(settings.callback_enter, element, entry, instance);
    if (!hasEmptyStatus(element)) {
        return; //Prevent loading it again
    }
    if (settings.unobserve_entered) {
        unobserve(element, instance);
    }
    load(element, settings, instance);
};

export const onExit = (element, entry, settings, instance) => {
    if (hasEmptyStatus(element)) {
        return; //Ignore the first pass, at landing
    }
    checkIfMustCancelLoading(element, entry, settings, instance);
    safeCallback(settings.callback_exit, element, entry, instance);
};
