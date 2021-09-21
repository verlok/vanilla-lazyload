const originalsProperty = "llOriginalAttrs";
const attrsSrc = ["src"];
const attrsSrcPoster = ["src", "poster"];
const attrsSrcSrcsetSizes = ["src", "srcset", "sizes"];

export const hasOriginalAttrs = (element) => !!element[originalsProperty];
export const getOriginalAttrs = (element) => element[originalsProperty];
export const deleteOriginalAttrs = (element) => delete element[originalsProperty];

// ## SAVE ##

const setOriginalsObject = (element, attributes) => {
    if (hasOriginalAttrs(element)) {
        return;
    }
    const originals = {};
    attributes.forEach((attribute) => {
        originals[attribute] = element.getAttribute(attribute);
    });
    element[originalsProperty] = originals;
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
    element[originalsProperty] = { backgroundImage: element.style.backgroundImage };
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
