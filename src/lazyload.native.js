import { revealElement } from "./lazyload.reveal";

const nativeLazyTags = ["IMG", "IFRAME"];

export const shouldUseNative = settings =>
	settings.use_native && "loading" in HTMLImageElement.prototype;

export const loadAllNative = instance => {
	instance._elements.forEach(element => {
		if (nativeLazyTags.indexOf(element.tagName) === -1) {
			return;
		}
		element.setAttribute("loading", "lazy");
		revealElement(element, instance);
	});
};
