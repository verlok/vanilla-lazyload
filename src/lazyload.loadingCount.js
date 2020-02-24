import { callbackIfSet } from "./lazyload.callback";

export const updateLoadingCount = (instance, plusMinus) => {
    instance.loadingCount += plusMinus;
    if (instance._elements.length === 0 && instance.loadingCount === 0) {
        callbackIfSet(instance._settings.callback_finish);
    }
};
