import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { hasEmptyStatus, hadStartedLoading } from "./lazyload.data";
import { cancelLoadingIfRequired } from "./lazyload.cancelOnExit";
import { unobserveIfRequired } from "./lazyload.unobserve";

export const onEnter = (element, entry, settings, instance) => {
    safeCallback(settings.callback_enter, element, entry, instance);
    unobserveIfRequired(element, settings, instance);
    if (hadStartedLoading(element)) return; //Prevent loading it again
    load(element, settings, instance);
};

export const onExit = (element, entry, settings, instance) => {
    if (hasEmptyStatus(element)) return; //Ignore the first pass, at landing
    cancelLoadingIfRequired(element, entry, settings, instance);
    safeCallback(settings.callback_exit, element, entry, instance);
};
