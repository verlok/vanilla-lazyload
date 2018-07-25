/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
export const isIntersecting = element =>
	element.isIntersecting || element.intersectionRatio > 0;

export const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: settings.threshold + "px"
});
