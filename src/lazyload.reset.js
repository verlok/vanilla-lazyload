import { setStatus, hasStatusLoading, hasStatusAfterLoading } from "./lazyload.data";
import { increaseToLoadCount } from "./lazyload.load";
import { decreaseLoadingCount } from "./lazyload.event";

export const resetElement = (element, instance) => {
    if (hasStatusAfterLoading(element)) {
        increaseToLoadCount(instance);
    }
    if (hasStatusLoading(element)) {
        decreaseLoadingCount(instance);
    }
    setStatus(element, null);
};
