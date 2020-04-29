import { delayLoad, cancelDelayLoad } from "./lazyload.delay";
import { safeCallback } from "./lazyload.callback";
import { load } from "./lazyload.load";
import { setStatus, getStatus } from "./lazyload.data";
import { statusEntered, statusObserved } from "./lazyload.elementStatus";

export const onIntersecting = (element, entry, instance) => {
    setStatus(element, statusEntered);
    const settings = instance._settings;
    safeCallback(settings.callback_enter, element, entry, instance);
    if (!settings.load_delay) {
        load(element, settings, instance);
        return;
    }
    delayLoad(element, settings, instance);
};


export const onNotIntersecting = (element, entry, instance) => {
    if (getStatus(element) !== statusEntered) return; //Keeps out status other than "entered"
    setStatus(element, statusObserved);
    const settings = instance._settings;
    safeCallback(settings.callback_exit, element, entry, instance);
    if (!settings.load_delay) return;
    cancelDelayLoad(element);
};
