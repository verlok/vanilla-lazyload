import { runningOnBrowser } from "./lazyload.environment";
import { resetStatus } from "./lazyload.data";
import { removeClass } from "./lazyload.class";
import { nodeSetToArray } from "./lazyload.dom";

export const retryLazyLoad = instance => {
    var settings = instance._settings;
    var errorElements = settings.container.querySelectorAll("[data-ll-status=error]"); //TODO: REFACTOR
    nodeSetToArray(errorElements).forEach(element => {
        removeClass(element, settings.class_error);
        resetStatus(element);
    });
    instance.update();
};

export const setOnlineCheck = instance => {
    if (!runningOnBrowser) {
        return;
    }
    window.addEventListener("online", event => {
        retryLazyLoad(instance);
    });
};
