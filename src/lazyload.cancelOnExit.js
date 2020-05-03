import { hasStatusLoading } from "./lazyload.data";
import { decreaseLoadingCount } from "./lazyload.event";
import { resetSources } from "./lazyload.setSources";
import { safeCallback } from "./lazyload.callback";

export const cancelIfLoading = (element, entry, settings, instance) => {
    if (!hasStatusLoading(element)) return;
    resetSources(element, settings, instance);
    decreaseLoadingCount(instance);
    // setTimeout is needed because the "callback_cancel" implementation
    // could be out of the main thread, e.g. `img.setAttribute("src", "")`
    setTimeout(() => {
        instance.resetElementStatus(element, instance);
    }, 0);
    safeCallback(settings.callback_cancel, element, entry, instance);
};
