import { forEachPictureSource, forEachVideoSource } from "./forEachSource";
import {
    restoreOriginalVideoAttrs,
    restoreOriginalImageAttrs,
    restoreOriginalBgImage,
    restoreOriginalIframeAttrs,
    restoreOriginalVideoSourceAttrs
} from "./originalAttributes";

export const restoreImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        restoreOriginalImageAttrs(sourceTag);
    });
    restoreOriginalImageAttrs(element);
};

export const restoreVideo = (element) => {
    forEachVideoSource(element, (sourceTag) => {
        restoreOriginalVideoSourceAttrs(sourceTag);
    });
    restoreOriginalVideoAttrs(element);
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
