import { SRC, SRCSET, SIZES, POSTER, ORIGINALS } from "./constants.js";

const attrsSrc = [SRC];
const attrsSrcPoster = [SRC, POSTER];
const attrsSrcSrcsetSizes = [SRC, SRCSET, SIZES];

export const hasOriginalAttrs = (element) => !!element[ORIGINALS];
export const getOriginalAttrs = (element) => element[ORIGINALS];
export const deleteOriginalAttrs = (element) => delete element[ORIGINALS];

// ## SAVE ##

const setOriginalsObject = (element, attributes) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    const originals = {};
    attributes.forEach((attribute) => {
        originals[attribute] = element.getAttribute(attribute);
    });
    element[ORIGINALS] = originals;
};

export const saveOriginalVideoSourceAttrs = (element) => {
    setOriginalsObject(element, attrsSrc);
};

export const saveOriginalVideoAttrs = (element) => {
    setOriginalsObject(element, attrsSrcPoster);
};

export const saveOriginalIframeAttrs = (element) => {
    setOriginalsObject(element, attrsSrc);
};

export const saveOriginalImageAttrs = (element) => {
    setOriginalsObject(element, attrsSrcSrcsetSizes);
};

export const saveOriginalBackgroundStyle = (element) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    element[ORIGINALS] = { backgroundImage: element.style.backgroundImage };
};

// ## RESTORE ##

const setOrResetAttribute = (element, attrName, value) => {
    if (!value) {
        element.removeAttribute(attrName);
        return;
    }
    element.setAttribute(attrName, value);
};

const restoreOriginalAttrs = (element, attributes) => {
    const originals = getOriginalAttrs(element);
    if (originals === null) {
        return;
    }
    attributes.forEach((attribute) =>
        setOrResetAttribute(element, attribute, originals[attribute])
    );
};

export const restoreOriginalImageAttrs = (imgOrSourceEl) =>
    restoreOriginalAttrs(imgOrSourceEl, attrsSrcSrcsetSizes);

export const restoreOriginalVideoSourceAttrs = (sourceEl) =>
    restoreOriginalAttrs(sourceEl, attrsSrc);

export const restoreOriginalVideoAttrs = (videoEl) => restoreOriginalAttrs(videoEl, attrsSrcPoster);

export const restoreOriginalIframeAttrs = (iframe) => restoreOriginalAttrs(iframe, attrsSrc);

export const restoreOriginalBgImage = (element) => {
    const originals = getOriginalAttrs(element);
    if (originals === null) {
        return;
    }
    element.style.backgroundImage = originals.backgroundImage;
};
