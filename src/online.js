import { runningOnBrowser } from "./environment";
import { resetStatus } from "./data";
import { removeClass } from "./class";
import { filterErrorElements, queryElements } from "./dom";

export const retryLazyLoad = (settings, instance) => {
  const errorElements = filterErrorElements(queryElements(settings));
  errorElements.forEach((element) => {
    removeClass(element, settings.class_error);
    resetStatus(element);
  });
  instance.update();
};

export const setOnlineCheck = (settings, instance) => {
  if (!runningOnBrowser) {
    return;
  }
  instance._onlineHandler = () => {
    retryLazyLoad(settings, instance);
  };
  window.addEventListener("online", instance._onlineHandler);
};

export const resetOnlineCheck = (instance) => {
  if (!runningOnBrowser) {
    return;
  }
  window.removeEventListener("online", instance._onlineHandler);
};