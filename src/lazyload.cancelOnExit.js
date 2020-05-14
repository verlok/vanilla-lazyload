import { removeEventListeners } from "./lazyload.event";
import {
	resetSourcesImg,
	restoreOriginalAttributesImg
} from "./lazyload.setSources";
import { safeCallback } from "./lazyload.callback";
import { removeClass } from "./lazyload.class";
import { updateLoadingCount } from "./lazyload.counters";
import { resetStatus } from "./lazyload.data";

export const cancelIfLoading = (element, entry, settings, instance) => {
	if (element.tagName !== "IMG") {
		// Can't cancel loading on anything but images
		return;
	}
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
