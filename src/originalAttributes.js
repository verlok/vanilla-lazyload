import { setOrResetAttribute } from "./set";

const originalsProperty = "llOriginalAttrs";

export const hasOriginalAttrs = (element) => {
    return !!element[originalsProperty];
};

export const saveOriginalVideoSourceAttrs = (element) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    element[originalsProperty] = original;
};

export const saveOriginalVideoAttrs = (element) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    original["poster"] = element.getAttribute("poster");
    element[originalsProperty] = original;
};

export const saveOriginalIframeAttrs = (element) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    element[originalsProperty] = original;
};

export const saveOriginalImageAttrs = (element) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    original["srcset"] = element.getAttribute("srcset");
    original["sizes"] = element.getAttribute("sizes");
    element[originalsProperty] = original;
};

export const saveOriginalBackgroundStyle = (element) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    const original = {};
    original.backgroundImage = element.style.backgroundImage;
    element[originalsProperty] = original;
}

export const deleteOriginalAttrs = (element) => delete element[originalsProperty];

export const getOriginalAttrs = (element) => element[originalsProperty];

export const restoreOriginalImageAttrs = (imgOrSourceEl) => {
    const originals = getOriginalAttrs(imgOrSourceEl);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(imgOrSourceEl, "src", originals["src"]);
    setOrResetAttribute(imgOrSourceEl, "srcset", originals["srcset"]);
    setOrResetAttribute(imgOrSourceEl, "sizes", originals["sizes"]);
};

export const restoreOriginalVideoSourceAttrs = (sourceEl) => {
    const originals = getOriginalAttrs(sourceEl);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(sourceEl, "src", originals["src"]);
};

export const restoreOriginalVideoAttrs = (videoEl) => {
    const originals = getOriginalAttrs(videoEl);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(videoEl, "src", originals["src"]);
    setOrResetAttribute(videoEl, "poster", originals["poster"]);
};

export const restoreOriginalIframeAttrs = (iframe) => {
    const originals = getOriginalAttrs(iframe);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(iframe, "src", originals["src"]);
};


export const restoreOriginalBgImage = (element) => {
    const originals = getOriginalAttrs(element);
    if (originals === null) {
        return;
    }
    element.style.backgroundImage = originals.backgroundImage;  
};