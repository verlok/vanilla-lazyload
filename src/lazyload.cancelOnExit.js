import { hasStatusLoading } from "./lazyload.data";
import { decreaseLoadingCount } from "./lazyload.event";
import { resetSourcesImg } from "./lazyload.setSources";
import { safeCallback } from "./lazyload.callback";

export const cancelIfLoading = (element, entry, settings, instance) => {
    if (!settings.cancel_on_exit) return;
    if (!hasStatusLoading(element)) return;
    if (element.tagName !== "IMG") return;
    resetSourcesImg(element, settings, instance);
    decreaseLoadingCount(instance);
    safeCallback(settings.callback_cancel, element, entry, instance);
    // setTimeout is needed because the "callback_cancel" implementation
    // could be out of the main thread, e.g. `img.setAttribute("src", "")`
    setTimeout(() => {
        instance.resetElementStatus(element, instance);
    }, 0);
};
