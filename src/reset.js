import { forEachPictureSource } from "./forEachSource";

const removeImageAttributes = (element) => {
    element.removeAttribute("src");
    element.removeAttribute("srcset");
    element.removeAttribute("sizes");
};

export const resetSourcesImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        removeImageAttributes(sourceTag);
    });
    removeImageAttributes(element);
};

export const resetSourcesVideo = (element) => {
    let sourceTags = getSourceTags(element);
    element.removeAttribute("src");
    element.removeAttribute("poster");
    sourceTags.forEach((sourceTag) => {
        resetAttribute(sourceTag, "src");
    });
};

export const resetSourcesIframe = (element) => {
    element.removeAttribute("src");
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
