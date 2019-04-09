export const shouldUseNative = instance =>
	instance._settings.use_native && "loading" in HTMLImageElement.prototype;

export const goNative = instance => {
	/*
	 * Filter elements for `["IMG", "IFRAME"]`, and for these
	 * Set the `loading` attribute to `lazy`
	 * `reveal()` them
	 */
};
