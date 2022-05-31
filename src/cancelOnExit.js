import { removeEventListeners } from "./event";
import { resetSourcesImg } from "./reset";
import { restoreImg } from "./restore";
import { safeCallback } from "./callback";
import { removeClass } from "./class";
import { updateLoadingCount } from "./counters";
import { hasStatusLoading, resetStatus } from "./data";

export const cancelLoading = (element, entry, settings, instance) => {
  if (!settings.cancel_on_exit) return;
  if (!hasStatusLoading(element)) return;
  if (element.tagName !== "IMG") return; //Works only on images
  removeEventListeners(element);
  resetSourcesImg(element);
  restoreImg(element);
  removeClass(element, settings.class_loading);
  updateLoadingCount(instance, -1);
  resetStatus(element);
  safeCallback(settings.callback_cancel, element, entry, instance);
};
