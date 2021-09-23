import { runningOnBrowser } from "./environment";
import { resetStatus } from "./data";
import { removeClass } from "./class";
import { queryElements, filterErrorElements } from "./dom";

export const retryLazyLoad = (settings, instance) => {
    const errorElements = filterErrorElements(queryElements(settings));
    errorElements.forEach(element => {
        removeClass(element, settings.class_error);
        resetStatus(element);
    });
    instance.update();
};

export const setOnlineCheck = (settings, instance) => {
    if (!runningOnBrowser) {
        return;
    }
    window.addEventListener("online", () => {
        retryLazyLoad(settings, instance);
    });
};
