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