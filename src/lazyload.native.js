import { revealElement } from "./lazyload.reveal";

export const shouldUseNative = (settings, force) =>
	force || (settings.use_native && "loading" in HTMLImageElement.prototype);

export const goNative = instance => {
	/*
	 * Filter elements for `["IMG", "IFRAME"]`, and for these
	 * Set the `loading` attribute to `lazy`
	 * `reveal()` them
	 */
	const nativeLazyTags = ["IMG", "IFRAME"];
	instance._elements.forEach(element => {
		if (nativeLazyTags.indexOf(element.tagName) === -1) {
			return;
		}
		element.setAttribute("loading", "lazy");
		revealElement(element, instance);
	});
};
