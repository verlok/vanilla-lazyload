export const updateLoadingCount = (instance, delta) => {
    if (!instance) return;
    instance.loadingCount += delta;
};

export const decreaseToLoadCount = (instance) => {
    if (!instance) return;
    instance.toLoadCount -= 1;
};

export const setToLoadCount = (instance, value) => {
    if (!instance) return;
    instance.toLoadCount = value;
};

export const isSomethingLoading = (instance) => instance.loadingCount > 0;

export const haveElementsToLoad = (instance) => instance.toLoadCount > 0;
