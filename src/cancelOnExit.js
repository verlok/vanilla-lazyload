import { removeEventListeners } from "./event";
import { resetSourcesImg, restoreOriginalAttributesImg } from "./setSources";
import { safeCallback } from "./callback";
import { removeClass } from "./class";
import { updateLoadingCount } from "./counters";
import { resetStatus, hasStatusLoading } from "./data";

export const cancelLoading = (element, entry, settings, instance) => {
    if (!settings.cancel_on_exit) return;
    if (!hasStatusLoading(element)) return;
    if (element.tagName !== "IMG") return; //Works only on images
    removeEventListeners(element);
    resetSourcesImg(element);
    restoreOriginalAttributesImg(element);
    removeClass(element, settings.class_loading);
    updateLoadingCount(instance, -1);
    resetStatus(element);
    safeCallback(settings.callback_cancel, element, entry, instance);
};
