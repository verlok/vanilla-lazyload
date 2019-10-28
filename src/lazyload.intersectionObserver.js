import { supportsIntersectionObserver } from "./lazyload.environment";
import { onEnter, onExit } from "./lazyload.reveal";

export const isIntersecting = entry =>
	entry.isIntersecting || entry.intersectionRatio > 0;

export const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: settings.thresholds || settings.threshold + "px"
});

export const processObserverEntries = entries => {
	entries.forEach(entry =>
		isIntersecting(entry)
			? onEnter(entry.target, instance)
			: onExit(entry.target, instance)
	);
};

export const takeRecords = instance => {
	if (!supportsIntersectionObserver || !instance._observer.takeRecords) {
		return;
	}
	processObserverEntries(instance._observer.takeRecords());	
};

export const setObserver = instance => {
	if (!supportsIntersectionObserver) {
		return false;
	}
	instance._observer = new IntersectionObserver(processObserverEntries, getObserverSettings(instance._settings));
	return true;
};
