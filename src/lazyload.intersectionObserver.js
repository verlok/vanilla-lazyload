/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
export const isIntersecting = entry =>
	entry.isIntersecting || entry.intersectionRatio > 0;

const getRootMarginString = threshold => {
	return typeof threshold === "string" ? threshold : threshold + "px";
	// add another check to avoid failure on string input without `px`?
	// return isNaN(temp) ? temp : temp + "px";
	// for now I'll just make it clear in the documentation? :)
};

export const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: getRootMarginString(settings.threshold),
	threshold: 0
});
