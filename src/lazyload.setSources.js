import { getData, setStatus } from "./lazyload.data";
import { statusLoading, statusApplied } from "./lazyload.elementStatus";
import { safeCallback } from "./lazyload.callback";
import { addClass } from "./lazyload.class";
import { getTempImage } from "./lazyload.tempImage";
import { isHiDpi } from "./lazyload.environment";
import { unobserve } from "./lazyload.unobserve";

const _src_ = "src";
const _srcset_ = "srcset";
const _sizes_ = "sizes";
const _poster_ = "poster";
const _PICTURE_ = "PICTURE";

export const increaseLoadingCount = (instance) => {
    if (!instance) return;
    instance.loadingCount += 1;
};

export const getSourceTags = (parentTag) => {
    let sourceTags = [];
    for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
        if (childTag.tagName === "SOURCE") {
            sourceTags.push(childTag);
        }
    }
    return sourceTags;
};

export const setAttributeIfValue = (element, attrName, value) => {
    if (!value) {
        return;
    }
    element.setAttribute(attrName, value);
};

export const resetAttribute = (element, attrName) => {
    element.removeAttribute(attrName);
};

export const hasOriginalAttributes = (element) => {
    return !!element.llOriginalAttrs;
};

export const saveOriginalImageAttributes = (element) => {
    if (hasOriginalAttributes(element)) return;
    const originalAttributes = {};
    originalAttributes[_src_] = element.getAttribute(_src_);
    originalAttributes[_srcset_] = element.getAttribute(_srcset_);
    originalAttributes[_sizes_] = element.getAttribute(_sizes_);
    element.llOriginalAttrs = originalAttributes;
};

export const restoreOriginalImageAttributes = (element) => {
    if (!hasOriginalAttributes(element)) return;
    const originalAttributes = element.llOriginalAttrs;
    setAttributeIfValue(element, _src_, originalAttributes[_src_]);
    setAttributeIfValue(element, _srcset_, originalAttributes[_srcset_]);
    setAttributeIfValue(element, _sizes_, originalAttributes[_sizes_]);
};

export const setImageAttributes = (element, settings) => {
    setAttributeIfValue(element, _sizes_, getData(element, settings.data_sizes));
    setAttributeIfValue(element, _srcset_, getData(element, settings.data_srcset));
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
};

export const resetImageAttributes = (element) => {
    resetAttribute(element, _src_);
    resetAttribute(element, _srcset_);
    resetAttribute(element, _sizes_);
};

export const forEachPictureSource = (element, fn) => {
    const parent = element.parentNode;
    if (!parent || parent.tagName !== _PICTURE_) return;

    let sourceTags = getSourceTags(parent);
    sourceTags.forEach(fn);
};

export const restoreOriginalAttributesImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        restoreOriginalImageAttributes(sourceTag);
    });
    restoreOriginalImageAttributes(element);
};

export const setSourcesImg = (element, settings) => {
    forEachPictureSource(element, (sourceTag) => {
        saveOriginalImageAttributes(sourceTag);
        setImageAttributes(sourceTag, settings);
    });
    saveOriginalImageAttributes(element);
    setImageAttributes(element, settings);
};

export const resetSourcesImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        resetImageAttributes(sourceTag);
    });
    resetImageAttributes(element);
};

export const setSourcesIframe = (element, settings) => {
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
};

export const resetSourcesIframe = (element) => {
    resetAttribute(element, _src_);
};

export const setSourcesVideo = (element, settings) => {
    let sourceTags = getSourceTags(element);
    sourceTags.forEach((sourceTag) => {
        setAttributeIfValue(sourceTag, _src_, getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, _poster_, getData(element, settings.data_poster));
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
    element.load();
};

export const resetSourcesVideo = (element) => {
    let sourceTags = getSourceTags(element);
    resetAttribute(element, _src_);
    resetAttribute(element, _poster_);
    sourceTags.forEach((sourceTag) => {
        resetAttribute(sourceTag, _src_);
    });
};

const setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
};

export const setBackground = (element, settings, instance) => {
    const bg1xValue = getData(element, settings.data_bg);
    const bgHiDpiValue = getData(element, settings.data_bg_hidpi);
    const bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) return;
    element.style.backgroundImage = `url("${bgDataValue}")`;
    getTempImage(element).setAttribute(_src_, bgDataValue);
    // Annotate and notify loading
    increaseLoadingCount(instance);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
    safeCallback(settings.callback_reveal, element, instance); // <== DEPRECATED
};

// NOTE: THE TEMP IMAGE TRICK CANNOT BE DONE WITH data-multi-bg
// BECAUSE INSIDE ITS VALUES MUST BE WRAPPED WITH URL() AND ONE OF THEM
// COULD BE A GRADIENT BACKGROUND IMAGE
export const setMultiBackground = (element, settings, instance) => {
    const bg1xValue = getData(element, settings.data_bg_multi);
    const bgHiDpiValue = getData(element, settings.data_bg_multi_hidpi);
    const bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) return;
    element.style.backgroundImage = bgDataValue;
    // Annotate and notify applied
    addClass(element, settings.class_applied);
    setStatus(element, statusApplied);
    unobserve(element, settings, instance); // Unobserve here because we can't do it on load
    safeCallback(settings.callback_applied, element, instance);
};

export const setSources = (element, settings, instance) => {
    const setSourcesFunction = setSourcesFunctions[element.tagName];
    if (!setSourcesFunction) return;
    setSourcesFunction(element, settings);
    // Annotate and notify loading
    increaseLoadingCount(instance);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
    safeCallback(settings.callback_reveal, element, instance); // <== DEPRECATED
};
