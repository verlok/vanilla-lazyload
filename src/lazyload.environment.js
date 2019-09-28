export const runningOnBrowser = typeof window !== "undefined";

export const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	(typeof navigator !== "undefined" &&
		/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent));

export const supportsIntersectionObserver =
	runningOnBrowser &&
	"IntersectionObserver" in window &&
	"IntersectionObserverEntry" in window &&
	"intersectionRatio" in window.IntersectionObserverEntry.prototype &&
	"isIntersecting" in window.IntersectionObserverEntry.prototype;

export const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

export const supportsCreateImageBitmap =
	runningOnBrowser && "createImageBitmap" in window;

export const supportsFetch = runningOnBrowser && "fetch" in window;
