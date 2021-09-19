import { forEachPictureSource } from "./forEachSource";

const resetAttribute = (element, attrName) => {
    element.removeAttribute(attrName);
};

const resetImageAttributes = (element) => {
    resetAttribute(element, "src");
    resetAttribute(element, "srcset");
    resetAttribute(element, "sizes");
};

export const resetSourcesImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        resetImageAttributes(sourceTag);
    });
    resetImageAttributes(element);
};

export const resetSourcesVideo = (element) => {
    let sourceTags = getSourceTags(element);
    resetAttribute(element, "src");
    resetAttribute(element, "poster");
    sourceTags.forEach((sourceTag) => {
        resetAttribute(sourceTag, "src");
    });
};

export const resetSourcesIframe = (element) => {
    resetAttribute(element, "src");
};

const resetSourcesFunctions = {
    IMG: resetSourcesImg,
    IFRAME: resetSourcesIframe,
    VIDEO: resetSourcesVideo
};

export const resetSources = (element) => {
    const resetSourcesFunction = resetSourcesFunctions[element.tagName];
    if (!resetSourcesFunction) {
        return;
    }
    resetSourcesFunction(element);
};
