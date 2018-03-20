export const runningOnBrowser = (typeof window !== "undefined");

export const supportsIntersectionObserver = runningOnBrowser && ("IntersectionObserver" in window);

export const supportsClassList = runningOnBrowser && ("classList" in document.createElement("p"));