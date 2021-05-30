import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { hasEmptyStatus, hadStartedLoading, setStatus } from "./lazyload.data";
import { cancelLoading } from "./lazyload.cancelOnExit";
import { unobserveEntered } from "./lazyload.unobserve";
import { statusEntered } from "./lazyload.elementStatus";
import { addClass, removeClass } from "./lazyload.class";

export const onEnter = (element, entry, settings, instance) => {
    const dontLoad = hadStartedLoading(element); /* Save status 
        before setting it, to prevent loading it again. Fixes #526. */
    setStatus(element, statusEntered);
    addClass(element, settings.class_entered);
    removeClass(element, settings.class_exited);
    unobserveEntered(element, settings, instance);
    safeCallback(settings.callback_enter, element, entry, instance);
    if (dontLoad) return;
    load(element, settings, instance);
};

export const onExit = (element, entry, settings, instance) => {
    if (hasEmptyStatus(element)) return; //Ignore the first pass, at landing
    addClass(element, settings.class_exited);
    cancelLoading(element, entry, settings, instance);
    safeCallback(settings.callback_exit, element, entry, instance);
};
