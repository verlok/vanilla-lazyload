import { getData, setStatus } from "./data";
import { statusLoading, statusApplied } from "./elementStatus";
import { safeCallback } from "./callback";
import { addClass } from "./class";
import { getTempImage } from "./tempImage";
import { isHiDpi } from "./environment";
import { unobserve } from "./unobserve";
import { updateLoadingCount } from "./counters";
import { forEachPictureSource, forEachVideoSource } from "./forEachSource";
import { saveOriginalImageAttributes } from "./originalAttributes";

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

export const setOrResetAttribute = (element, attrName, value) => {
    if (!value) {
        element.removeAttribute(attrName);
        return;
    }
    element.setAttribute(attrName, value);
};

export const setImageAttributes = (element, settings) => {
    setAttributeIfValue(element, "sizes", getData(element, settings.data_sizes));
    setAttributeIfValue(element, "srcset", getData(element, settings.data_srcset));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const setSourcesImg = (element, settings) => {
    forEachPictureSource(element, (sourceTag) => {
        saveOriginalImageAttributes(sourceTag);
        setImageAttributes(sourceTag, settings);
    });
    saveOriginalImageAttributes(element);
    setImageAttributes(element, settings);
};

export const setSourcesIframe = (element, settings) => {
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const setSourcesVideo = (element, settings) => {
    forEachVideoSource(element, (sourceTag) => {
        setAttributeIfValue(sourceTag, "src", getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, "poster", getData(element, settings.data_poster));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
    element.load();
};

export const setBackground = (element, settings, instance) => {
    const bg1xValue = getData(element, settings.data_bg);
    const bgHiDpiValue = getData(element, settings.data_bg_hidpi);
    const bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) return;
    element.style.backgroundImage = `url("${bgDataValue}")`;
    getTempImage(element).setAttribute("src", bgDataValue);
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

const setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
};

export const setSources = (element, settings, instance) => {
    const setSourcesFunction = setSourcesFunctions[element.tagName];
    if (!setSourcesFunction) {
        return;
    }
    setSourcesFunction(element, settings);
    manageLoading(element, settings, instance);
};

