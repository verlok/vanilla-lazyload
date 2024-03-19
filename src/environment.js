export const runningOnBrowser = typeof window !== "undefined";

export const isBot =
  (runningOnBrowser && !("onscroll" in window)) ||
  (typeof navigator !== "undefined" && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent));

export const isHiDpi = runningOnBrowser && window.devicePixelRatio > 1;
