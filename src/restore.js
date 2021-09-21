import { forEachPictureSource, forEachVideoSource } from "./forEachSource";
import {
    restoreOriginalBgImage,
    restoreOriginalAttrs,
    attrsSrcSrcsetSizes,
    attrsSrc,
    attrsSrcPoster
} from "./originalAttributes";

export const restoreImg = (imgEl) => {
    forEachPictureSource(imgEl, (sourceEl) => {
        restoreOriginalAttrs(sourceEl, attrsSrcSrcsetSizes);
    });
    restoreOriginalAttrs(imgEl, attrsSrcSrcsetSizes);
};

export const restoreVideo = (videoEl) => {
    forEachVideoSource(videoEl, (sourceEl) => {
        restoreOriginalAttrs(sourceEl, attrsSrc);
    });
    restoreOriginalAttrs(videoEl, attrsSrcPoster);
};

export const restoreIframe = (iframeEl) => {
    restoreOriginalAttrs(iframeEl, attrsSrc);
};

const restoreFunctions = {
    IMG: restoreImg,
    IFRAME: restoreIframe,
    VIDEO: restoreVideo
};

export const restore = (element) => {
    const restoreFunction = restoreFunctions[element.tagName];
    if (!restoreFunction) {
        restoreOriginalBgImage(element);
        return;
    }
    restoreFunction(element);
};
