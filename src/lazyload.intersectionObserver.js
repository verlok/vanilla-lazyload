import { supportsIntersectionObserver } from "./lazyload.environment";
import { onIntersecting, onNotIntersecting } from "./lazyload.intersectionHandlers";
import { setStatus } from "./lazyload.data";
import { statusObserved } from "./lazyload.elementStatus";
import { shouldUseNative } from "./lazyload.native";
import { resetObserver } from "./lazyload.unobserve";

export const isIntersecting = (entry) => entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = (settings) => ({
    root: settings.container === document ? null : settings.container,
    rootMargin: settings.thresholds || settings.threshold + "px"
});

const intersectionHandler = (entries, settings, instance) => {
    entries.forEach((entry) =>
        isIntersecting(entry)
            ? onIntersecting(entry.target, entry, settings, instance)
            : onNotIntersecting(entry.target, entry, settings, instance)
    );
};

export const observeElements = (observer, elements) => {
    elements.forEach((element) => {
        observer.observe(element);
        setStatus(element, statusObserved);
    });
};

export const updateObserver = (observer, elementsToObserve) => {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
};

export const setObserver = (instance) => {
    const settings = instance._settings;
    if (!supportsIntersectionObserver || shouldUseNative(instance._settings)) {
        return;
    }
    instance._observer = new IntersectionObserver((entries) => {
        intersectionHandler(entries, settings, instance);
    }, getObserverSettings(settings));
};
