import { delayLoad, cancelDelayLoad } from "./lazyload.delay";
import { safeCallback } from "./lazyload.callback";
import { revealAndUnobserve } from "./lazyload.reveal";

export const onEnter = (element, entry, instance) => {
    const settings = instance._settings;
    safeCallback(settings.callback_enter, element, entry, instance);
    if (!settings.load_delay) {
        revealAndUnobserve(element, instance);
        return;
    }
    delayLoad(element, instance);
};

export const onExit = (element, entry, instance) => {
    const settings = instance._settings;
    safeCallback(settings.callback_exit, element, entry, instance);
    if (!settings.load_delay) {
        return;
    }
    cancelDelayLoad(element);
};
