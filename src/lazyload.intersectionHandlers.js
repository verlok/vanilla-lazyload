import { delayLoad, cancelDelayLoad } from "./lazyload.delay";
import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";

export const onEnter = (element, entry, instance) => {
    const settings = instance._settings;
    safeCallback(settings.callback_enter, element, entry, instance);
    if (!settings.load_delay) {
        load(element, instance);
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
