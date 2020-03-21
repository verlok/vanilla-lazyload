import { supportsIntersectionObserver } from "./lazyload.environment";
import { onEnter, onExit } from "./lazyload.intersectionHandlers";
import { setStatus } from "./lazyload.data";
import { statusObserved } from "./lazyload.elementStatus";
import { toArray } from "./lazyload.dom";

export const isIntersecting = entry => entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = settings => ({
    root: settings.container === document ? null : settings.container,
    rootMargin: settings.thresholds || settings.threshold + "px"
});

export const resetObserver = observer => {
    observer.disconnect();
};

export const observeElements = (observer, elements) => {
    elements.forEach(element => {
        observer.observe(element);
        setStatus(element, statusObserved);
    });
};

export const setObserver = instance => {
    if (!supportsIntersectionObserver) {
        return false;
    }
    instance._observer = new IntersectionObserver(entries => {
        entries.forEach(entry =>
            isIntersecting(entry)
                ? onEnter(entry.target, entry, instance)
                : onExit(entry.target, entry, instance)
        );
    }, getObserverSettings(instance._settings));
    return true;
};
