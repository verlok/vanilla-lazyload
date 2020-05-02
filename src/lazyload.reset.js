import { setStatus, hasStatusLoading, hasStatusAfterLoading } from "./lazyload.data";
import { increaseToLoadCount } from "./lazyload.load";
import { decreaseLoadingCount } from "./lazyload.event";

export const resetElement = (element, instance) => {
    setStatus(element, null);
    if (!instance) return;
    if (hasStatusAfterLoading(element)) {
        increaseToLoadCount(instance);
    }
    if (hasStatusLoading(element)) {
        decreaseLoadingCount(instance);
    }
};
