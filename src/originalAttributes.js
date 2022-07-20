import { DATA, ORIGINALS, POSTER, SIZES, SRC, SRCSET } from "./constants.js";

export const attrsSrc = [SRC];
export const attrsSrcPoster = [SRC, POSTER];
export const attrsSrcSrcsetSizes = [SRC, SRCSET, SIZES];
export const attrsData = [DATA];

export const hasOriginalAttrs = (element) => !!element[ORIGINALS];
export const getOriginalAttrs = (element) => element[ORIGINALS];
export const deleteOriginalAttrs = (element) => delete element[ORIGINALS];

// ## SAVE ##

export const setOriginalsObject = (element, attributes) => {
  if (hasOriginalAttrs(element)) {
    return;
  }
  const originals = {};
  attributes.forEach((attribute) => {
    originals[attribute] = element.getAttribute(attribute);
  });
  element[ORIGINALS] = originals;
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

export const restoreOriginalAttrs = (element, attributes) => {
  if (!hasOriginalAttrs(element)) {
    return;
  }
  const originals = getOriginalAttrs(element);
  attributes.forEach((attribute) => {
    setOrResetAttribute(element, attribute, originals[attribute]);
  });
};

export const restoreOriginalBgImage = (element) => {
  if (!hasOriginalAttrs(element)) {
    return;
  }
  const originals = getOriginalAttrs(element);
  element.style.backgroundImage = originals.backgroundImage;
};
