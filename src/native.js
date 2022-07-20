import { loadNative } from "./load";
import { setToLoadCount } from "./counters";

const tagsWithNativeLazy = ["IMG", "IFRAME", "VIDEO"];

export const shouldUseNative = (settings) =>
  settings.use_native && "loading" in HTMLImageElement.prototype;

export const loadAllNative = (elements, settings, instance) => {
  elements.forEach((element) => {
    if (tagsWithNativeLazy.indexOf(element.tagName) === -1) {
      return;
    }
    loadNative(element, settings, instance);
  });
  setToLoadCount(instance, 0);
};
