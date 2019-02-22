import { callbackIfSet } from "./lazyload.callback";

export const updateLoadingCount = (instance, plusMinus) => {
	instance._loadingCount += plusMinus;
	if (instance._elements.length === 0 && instance._loadingCount === 0) {
		callbackIfSet(instance._settings.callback_finish);
	}
};
