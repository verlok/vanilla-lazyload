import { setStatus, hasStatusAfterLoading } from "./lazyload.data";
import { increaseToLoadCount } from "./lazyload.load";

export const resetElementStatus = (element, instance) => {
    if (hasStatusAfterLoading(element)) {
        increaseToLoadCount(instance);
    }
    setStatus(element, null);
};
