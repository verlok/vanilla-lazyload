import { hasStatusLoading } from "./lazyload.data";
import { decreaseLoadingCount, removeEventListeners } from "./lazyload.event";
import { resetSourcesImg } from "./lazyload.setSources";
import { safeCallback } from "./lazyload.callback";
import { removeClass } from "./lazyload.class";

export const cancelIfLoading = (element, entry, settings, instance) => {
    if (!settings.cancel_on_exit) return;
    if (!hasStatusLoading(element)) return;
    if (element.tagName !== "IMG") return;
    removeEventListeners(element);
    resetSourcesImg(element, settings, instance);
    removeClass(element, settings.class_loading);
    decreaseLoadingCount(instance);
    safeCallback(settings.callback_cancel, element, entry, instance);
    // setTimeout is needed because the "callback_cancel" implementation
    // could be out of the main thread, e.g. `img.setAttribute("src", "")`
    setTimeout(() => {
        instance.resetElementStatus(element, instance);
    }, 0);
};
