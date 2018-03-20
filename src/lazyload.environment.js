export const runningOnBrowser = (typeof window !== "undefined");

export const supportsClassList = runningOnBrowser && ("classList" in document.createElement("p"));