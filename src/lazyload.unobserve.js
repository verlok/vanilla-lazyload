export const unobserve = (element, settings, instance) => {
    if (!instance) return;
    const observer = instance._observer;
    if (!observer || !settings.auto_unobserve) return;
    observer.unobserve(element);
};

export const resetObserver = (observer) => {
    observer.disconnect();
};