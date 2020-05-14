import { removeEventListeners } from "./lazyload.event";
import {
	resetSourcesImg,
	restoreOriginalAttributesImg
} from "./lazyload.setSources";
import { safeCallback } from "./lazyload.callback";
import { removeClass } from "./lazyload.class";
import { updateLoadingCount } from "./lazyload.counters";
import { resetStatus, hasStatusLoading } from "./lazyload.data";

export const checkIfMustCancelLoading = (element, entry, settings, instance) => {
	if (!settings.cancel_on_exit) return;
	if (!hasStatusLoading(element)) return;
	if (element.tagName !== "IMG") return; //Works only on images
	removeEventListeners(element);
	resetSourcesImg(element, settings, instance);
	restoreOriginalAttributesImg(element);
	removeClass(element, settings.class_loading);
	updateLoadingCount(instance, -1);
	safeCallback(settings.callback_cancel, element, entry, instance);
	// setTimeout is needed because the "callback_cancel" implementation
	// could be out of the main thread, e.g. `img.setAttribute("src", "")`
	setTimeout(() => {
		resetStatus(element);
	}, 0);
};