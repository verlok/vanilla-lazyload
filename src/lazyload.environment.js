export const runningOnBrowser = typeof window !== "undefined";

export const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

export const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/glebot|bingbot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
