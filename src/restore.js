import { forEachPictureSource, forEachVideoSource } from "./forEachSource";
import { getOriginalAttributes } from "./originalAttributes";
import { setOrResetAttribute } from "./set";

// ## IMAGE ##

export const restoreOriginalImageOrSourceAttributes = (imgOrSourceEl) => {
    const originals = getOriginalAttributes(imgOrSourceEl);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(imgOrSourceEl, "src", originals["src"]);
    setOrResetAttribute(imgOrSourceEl, "srcset", originals["srcset"]);
    setOrResetAttribute(imgOrSourceEl, "sizes", originals["sizes"]);
};

export const restoreImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        restoreOriginalImageOrSourceAttributes(sourceTag);
    });
    restoreOriginalImageOrSourceAttributes(element);
};

// ## VIDEO ##

export const restoreVideoSourcesAttributes = (sourceEl) => {
    const originals = getOriginalAttributes(sourceEl);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(sourceEl, "src", originals["src"]);
};

export const restoreOriginalVideoAttributes = (videoEl) => {
    const originals = getOriginalAttributes(videoEl);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(videoEl, "src", originals["src"]);
    setOrResetAttribute(videoEl, "poster", originals["poster"]);
};

export const restoreVideo = (element) => {
    forEachVideoSource(element, (sourceTag) => {
        restoreVideoSourcesAttributes(sourceTag);
    });
    restoreOriginalVideoAttributes(element);
};

// ## IFRAME ##

export const restoreIframe = (iframe) => {
    const originals = getOriginalAttributes(iframe);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(iframe, "src", originals["src"]);
};

// ## GENERIC ##

export const restoreGeneric = (element) => {
    const originals = getOriginalAttributes(element);
    if (originals === null) {
        return;
    }
    element.style.backgroundImage = originals.backgroundImage;  
};

// ## SWITCHER ##

const restoreFunctions = {
    IMG: restoreImg,
    IFRAME: restoreIframe,
    VIDEO: restoreVideo
};

export const restore = (element) => {
    const restoreFunction = restoreFunctions[element.tagName];
    if (!restoreFunction) {
        restoreGeneric(element);
        return;
    }
    restoreFunction(element);
};
