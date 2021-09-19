import { forEachPictureSource } from "./forEachSource";
import { hasOriginalAttributes } from "./originalAttributes";
import { setAttributeIfValue } from "./set";

export const restoreSrcSrcsetSizes = (element) => {
    if (!hasOriginalAttributes(element)) {
        return;
    }
    const original = element.llOriginalAttrs;
    setAttributeIfValue(element, "src", original["src"]);
    setAttributeIfValue(element, "srcset", original["srcset"]);
    setAttributeIfValue(element, "sizes", original["sizes"]);
};

export const restoreImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        restoreSrcSrcsetSizes(sourceTag);
    });
    restoreSrcSrcsetSizes(element);
};

export const restoreVideo = (element) => {
    //...
};

export const restoreIframe = (element) => {
    //...
};

const restoreFunctions = {
    IMG: restoreImg,
    IFRAME: restoreIframe,
    VIDEO: restoreVideo
};

export const restore = (element) => {
    const restoreFunction = restoreFunctions[element.tagName];
    if (!restoreFunction) {
        return;
    }
    restoreFunction(element);
};
