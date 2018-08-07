export const runningOnBrowser = typeof window !== "undefined";

export const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

export const supportsIntersectionObserver =
	runningOnBrowser && "IntersectionObserver" in window;

export const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

export const detectWebp = () => {
	var canvas,
		webpString = "image/webp";

	if (!runningOnBrowser) {
		return false;
	}

	canvas = document.createElement("canvas");

	if (canvas.getContext && canvas.getContext("2d")) {
		return canvas.toDataURL(webpString).indexOf("data:" + webpString) === 0;
	}

	return false;
};

export const supportsWebp = detectWebp();
