import { SIZES, SRC, SRCSET } from "./constants.js";
import { forEachPictureSource } from "./forEachSource";

const removeImageAttributes = (element) => {
  element.removeAttribute(SRC);
  element.removeAttribute(SRCSET);
  element.removeAttribute(SIZES);
};

export const resetSourcesImg = (element) => {
  forEachPictureSource(element, (sourceTag) => {
    removeImageAttributes(sourceTag);
  });
  removeImageAttributes(element);
};