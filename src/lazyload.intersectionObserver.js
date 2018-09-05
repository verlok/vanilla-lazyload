/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
export const isIntersecting = entry =>
	entry.isIntersecting || entry.intersectionRatio > 0;

const getRootMarginString = threshold =>
	isNaN(threshold) ? threshold : threshold + "px";

export const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: getRootMarginString(settings.threshold),
	threshold: 0
});
