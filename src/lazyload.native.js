import { loadNative } from "./lazyload.load";

const nativeLazyTags = ["IMG", "IFRAME"];
const loadingString = "loading";

export const shouldUseNative = settings =>
    settings.use_native && loadingString in HTMLImageElement.prototype;

export const loadAllNative = (elements, settings, instance) => {
    elements.forEach(element => {
        if (nativeLazyTags.indexOf(element.tagName) === -1) {
            return;
        }
        element.setAttribute(loadingString, "lazy");
        loadNative(element, settings, instance);
    });
    instance.toLoadCount = 0;
};
