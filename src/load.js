import { setBackground, setImgsetBackground, setMultiBackground, setSources, setSourcesNative } from "./set";
import { setStatus } from "./data";
import { addOneShotEventListeners, hasLoadEvent } from "./event";
import { statusNative } from "./elementStatus";
import { addTempImage } from "./tempImage";
import { saveOriginalBackgroundStyle } from "./originalAttributes";

const loadBackground = (element, settings, instance) => {
  addTempImage(element);
  addOneShotEventListeners(element, settings, instance);
  saveOriginalBackgroundStyle(element);
  setBackground(element, settings, instance);
  setMultiBackground(element, settings, instance);
  setImgsetBackground(element, settings, instance);
};

const loadRegular = (element, settings, instance) => {
  addOneShotEventListeners(element, settings, instance);
  setSources(element, settings, instance);
};

export const load = (element, settings, instance) => {
  if (hasLoadEvent(element)) {
    loadRegular(element, settings, instance);
  } else {
    loadBackground(element, settings, instance);
  }
};

export const loadNative = (element, settings, instance) => {
  element.setAttribute("loading", "lazy");
  addOneShotEventListeners(element, settings, instance);
  setSourcesNative(element, settings);
  setStatus(element, statusNative);
};
