export const unobserve = (element, instance) => {
    if (!instance) return;
    const observer = instance._observer;
    if (!observer) return;
    observer.unobserve(element);
};

export const resetObserver = (observer) => {
    observer.disconnect();
};

export const unobserveEntered = (element, settings, instance) => {
    if (settings.unobserve_entered) unobserve(element, instance);
}