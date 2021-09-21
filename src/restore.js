import { forEachPictureSource, forEachVideoSource } from "./forEachSource";
import {
    restoreOriginalVideoAttrs,
    restoreOriginalImageAttrs,
    restoreOriginalBgImage,
    restoreOriginalIframeAttrs,
    restoreOriginalVideoSourceAttrs
} from "./originalAttributes";

export const restoreImg = (imgEl) => {
    forEachPictureSource(imgEl, (sourceEl) => {
        restoreOriginalImageAttrs(sourceEl);
    });
    restoreOriginalImageAttrs(imgEl);
};

export const restoreVideo = (videoEl) => {
    forEachVideoSource(videoEl, (sourceEl) => {
        restoreOriginalVideoSourceAttrs(sourceEl);
    });
    restoreOriginalVideoAttrs(videoEl);
};

const restoreIframe = restoreOriginalIframeAttrs;

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
