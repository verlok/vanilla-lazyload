import { DATA, POSTER, SIZES, SRC, SRCSET } from "./constants.js";
import { getData, setStatus } from "./data";
import { statusApplied, statusLoading } from "./elementStatus";
import { safeCallback } from "./callback";
import { addClass } from "./class";
import { getTempImage } from "./tempImage";
import { isHiDpi } from "./environment";
import { unobserve } from "./unobserve";
import { updateLoadingCount } from "./counters";
import { forEachPictureSource, forEachVideoSource } from "./forEachSource";
import { attrsData, attrsSrc, attrsSrcPoster, attrsSrcSrcsetSizes, setOriginalsObject } from "./originalAttributes";

export const manageApplied = (element, settings, instance) => {
  addClass(element, settings.class_applied);
  setStatus(element, statusApplied);
  // Instance is not provided when loading is called from static class
  if (!instance) return;
  if (settings.unobserve_completed) {
    // Unobserve now because we can't do it on load
    unobserve(element, settings, instance);
  }
  safeCallback(settings.callback_applied, element, instance);
};

export const manageLoading = (element, settings, instance) => {
  addClass(element, settings.class_loading);
  setStatus(element, statusLoading);
  // Instance is not provided when loading is called from static class
  if (!instance) return;
  updateLoadingCount(instance, +1);
  safeCallback(settings.callback_loading, element, instance);
};

export const setAttributeIfValue = (element, attrName, value) => {
  if (!value) {
    return;
  }
  element.setAttribute(attrName, value);
};

export const setImageAttributes = (element, settings) => {
  setAttributeIfValue(element, SIZES, getData(element, settings.data_sizes));
  setAttributeIfValue(element, SRCSET, getData(element, settings.data_srcset));
  setAttributeIfValue(element, SRC, getData(element, settings.data_src));
};

export const setSourcesImg = (imgEl, settings) => {
  forEachPictureSource(imgEl, (sourceTag) => {
    setOriginalsObject(sourceTag, attrsSrcSrcsetSizes);
    setImageAttributes(sourceTag, settings);
  });
  setOriginalsObject(imgEl, attrsSrcSrcsetSizes);
  setImageAttributes(imgEl, settings);
};

export const setSourcesIframe = (iframe, settings) => {
  setOriginalsObject(iframe, attrsSrc);
  setAttributeIfValue(iframe, SRC, getData(iframe, settings.data_src));
};

export const setSourcesVideo = (videoEl, settings) => {
  forEachVideoSource(videoEl, (sourceEl) => {
    setOriginalsObject(sourceEl, attrsSrc);
    setAttributeIfValue(sourceEl, SRC, getData(sourceEl, settings.data_src));
  });
  setOriginalsObject(videoEl, attrsSrcPoster);

  setAttributeIfValue(videoEl, POSTER, getData(videoEl, settings.data_poster));
  setAttributeIfValue(videoEl, SRC, getData(videoEl, settings.data_src));
  videoEl.load();
};

export const setSourcesObject = (object, settings) => {
  setOriginalsObject(object, attrsData);
  setAttributeIfValue(object, DATA, getData(object, settings.data_src));
};

export const setBackground = (element, settings, instance) => {
  const bg1xValue = getData(element, settings.data_bg);
  const bgHiDpiValue = getData(element, settings.data_bg_hidpi);
  const bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
  if (!bgDataValue) return;
  element.style.backgroundImage = `url("${bgDataValue}")`;
  getTempImage(element).setAttribute(SRC, bgDataValue);
  manageLoading(element, settings, instance);
};

// NOTE: THE TEMP IMAGE TRICK CANNOT BE DONE WITH data-multi-bg
// BECAUSE INSIDE ITS VALUES MUST BE WRAPPED WITH URL() AND ONE OF THEM
// COULD BE A GRADIENT BACKGROUND IMAGE
export const setMultiBackground = (element, settings, instance) => {
  const bg1xValue = getData(element, settings.data_bg_multi);
  const bgHiDpiValue = getData(element, settings.data_bg_multi_hidpi);
  const bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
  if (!bgDataValue) {
    return;
  }
  element.style.backgroundImage = bgDataValue;
  manageApplied(element, settings, instance);
};

export const setImgsetBackground = (element, settings, instance) => {
  const bgImgSetDataValue = getData(element, settings.data_bg_set);
  if (!bgImgSetDataValue) {
    return;
  }
  const imgSetValues = bgImgSetDataValue.split("|");
  let bgImageValues = imgSetValues.map((value) => `image-set(${value})`);
  element.style.backgroundImage = bgImageValues.join();
  manageApplied(element, settings, instance);
};

const setSourcesFunctions = {
  IMG: setSourcesImg,
  IFRAME: setSourcesIframe,
  VIDEO: setSourcesVideo,
  OBJECT: setSourcesObject
};

export const setSourcesNative = (element, settings) => {
  const setSourcesFunction = setSourcesFunctions[element.tagName];
  if (!setSourcesFunction) {
    return;
  }
  setSourcesFunction(element, settings);
};

export const setSources = (element, settings, instance) => {
  const setSourcesFunction = setSourcesFunctions[element.tagName];
  if (!setSourcesFunction) {
    return;
  }
  setSourcesFunction(element, settings);
  manageLoading(element, settings, instance);
};
