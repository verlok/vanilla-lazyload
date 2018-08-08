import { detectWebp } from "./lazyload.webp";

export const runningOnBrowser = typeof window !== "undefined";

export const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
export const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

export const supportsWebp = runningOnBrowser && detectWebp();
