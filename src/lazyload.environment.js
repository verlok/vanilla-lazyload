export const runningOnBrowser = typeof window !== "undefined";

export const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

export const supportsIntersectionObserver =
	runningOnBrowser && "IntersectionObserver" in window;

export const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

export const detectWebP = () => {
	if (!runningOnBrowser) {
		return false;
	}

	var webPString = "image/webp";
	var elem = document.createElement("canvas");

	if (elem.getContext && elem.getContext("2d")) {
		return elem.toDataURL(webPString).indexOf("data:" + webPString) === 0;
	}

	return false;
};

export const supportsWebP = detectWebP();
