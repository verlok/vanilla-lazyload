import { forEachPictureSource } from "./forEachSource";
import { getOriginalAttributes } from "./originalAttributes";
import { setOrResetAttribute } from "./set";

export const restoreSrcSrcsetSizes = (element) => {
    const originals = getOriginalAttributes(element);
    if (originals === null) {
        return;
    }
    setOrResetAttribute(element, "src", originals["src"]);
    setOrResetAttribute(element, "srcset", originals["srcset"]);
    setOrResetAttribute(element, "sizes", originals["sizes"]);
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
