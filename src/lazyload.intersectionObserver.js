export const isIntersecting = entry => entry.intersectionRatio > 0;

export const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: settings.thresholds || settings.threshold + "px"
});
