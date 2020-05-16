import { loadNative } from "./lazyload.load";
import { setToLoadCount } from "./lazyload.counters";

const tagsWithNativeLazy = ["IMG", "IFRAME"];

export const shouldUseNative = (settings) =>
    settings.use_native && "loading" in HTMLImageElement.prototype;

export const loadAllNative = (elements, settings, instance) => {
    elements.forEach((element) => {
        if (tagsWithNativeLazy.indexOf(element.tagName) === -1) {
            return;
        }
        element.setAttribute("loading", "lazy"); //TODO: Move inside the loadNative method
        loadNative(element, settings, instance);
    });
    setToLoadCount(instance, 0);
};
