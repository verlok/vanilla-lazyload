import { runningOnBrowser } from "./lazyload.environment";
import { resetWasProcessedData } from "./lazyload.data";
import { removeClass } from "./lazyload.class";

export const retryLazyLoad = instance => {
	var settings = instance._settings;
	var errorElements = settings.container.querySelectorAll(
		"." + settings.class_error
	);
	[...errorElements].forEach(element => {
		removeClass(element, settings.class_error);
		resetWasProcessedData(element);
	});
	instance.update();
};

export const setOnlineCheck = instance => {
	if (!runningOnBrowser) {
		return;
	}
	window.addEventListener("online", event => {
		retryLazyLoad(instance);
	});
};
