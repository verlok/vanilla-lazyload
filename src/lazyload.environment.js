export const runningOnBrowser = typeof window !== "undefined";

export const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/glebot|bingbot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

export const supportsIntersectionObserver =
	runningOnBrowser && "IntersectionObserver" in window;

export const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");
