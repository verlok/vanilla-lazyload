import { getData, setData, setStatus } from "./lazyload.data";
import { statusLoading, statusApplied } from "./lazyload.elementStatus";
import { safeCallback } from "./lazyload.callback";
import { addClass } from "./lazyload.class";
import { getTempImage } from "./lazyload.tempImage";
import { isHiDpi } from "./lazyload.environment";
import { unobserve } from "./lazyload.unobserve";
import { updateLoadingCount } from "./lazyload.counters";

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
    if (hasOriginalAttributes(element)) {
        return;
    }
    const originalAttributes = {};
    originalAttributes["src"] = element.getAttribute("src");
    originalAttributes["srcset"] = element.getAttribute("srcset");
    originalAttributes["sizes"] = element.getAttribute("sizes");
    element.llOriginalAttrs = originalAttributes;
};

export const restoreOriginalImageAttributes = (element) => {
    if (!hasOriginalAttributes(element)) {
        return;
    }
    const originalAttributes = element.llOriginalAttrs;
    setAttributeIfValue(element, "src", originalAttributes["src"]);
    setAttributeIfValue(element, "srcset", originalAttributes["srcset"]);
    setAttributeIfValue(element, "sizes", originalAttributes["sizes"]);
};

export const setImageAttributes = (element, settings) => {
    setAttributeIfValue(element, "sizes", getData(element, settings.data_sizes));
    setAttributeIfValue(element, "srcset", getData(element, settings.data_srcset));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const resetImageAttributes = (element) => {
    resetAttribute(element, "src");
    resetAttribute(element, "srcset");
    resetAttribute(element, "sizes");
};

export const forEachPictureSource = (element, fn) => {
    const parent = element.parentNode;
    if (!parent || parent.tagName !== "PICTURE") {
        return;
    }
    let sourceTags = getSourceTags(parent);
    sourceTags.forEach(fn);
};

export const forEachVideoSource = (element, fn) => {
    let sourceTags = getSourceTags(element);
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
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const resetSourcesIframe = (element) => {
    resetAttribute(element, "src");
};

export const setSourcesVideo = (element, settings) => {
    forEachVideoSource(element, (sourceTag) => {
        setAttributeIfValue(sourceTag, "src", getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, "poster", getData(element, settings.data_poster));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
    element.load();
};

export const resetSourcesVideo = (element) => {
    let sourceTags = getSourceTags(element);
    resetAttribute(element, "src");
    resetAttribute(element, "poster");
    sourceTags.forEach((sourceTag) => {
        resetAttribute(sourceTag, "src");
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

export const setSources = (element, settings) => {
    const setSourcesFunction = setSourcesFunctions[element.tagName];
    if (!setSourcesFunction) {
        return;
    }
    setSourcesFunction(element, settings);
};

export const manageApplied = (element, settings, instance) => {
    addClass(element, settings.class_applied);
    setStatus(element, statusApplied);
    removeDataMultiBackground(element, settings);
    if (settings.unobserve_completed) {
        // Unobserve now because we can't do it on load
        unobserve(element, settings, instance);
    }
    safeCallback(settings.callback_applied, element, instance);
};

export const manageLoading = (element, settings, instance) => {
    updateLoadingCount(instance, +1);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
};

// REMOVE DATA ATTRIBUTES --------------

export const removeDataImg = (element, settings) => {
    setData(element, settings.data_src, null);
    setData(element, settings.data_srcset, null);
    setData(element, settings.data_sizes, null);
    forEachPictureSource(element, (sourceTag) => {
        setData(sourceTag, settings.data_srcset, null);
        setData(sourceTag, settings.data_sizes, null);
    });
};

export const removeDataIframe = (element, settings) => {
    setData(element, settings.data_src, null);
};

export const removeDataVideo = (element, settings) => {
    setData(element, settings.data_src, null);
    setData(element, settings.data_poster, null);
    forEachVideoSource(element, (sourceTag) => {
        setData(sourceTag, settings.data_src, null);
    });
};

const removeDataFunctions = {
    IMG: removeDataImg,
    IFRAME: removeDataIframe,
    VIDEO: removeDataVideo
};

export const removeDataBackground = (element, settings) => {
    setData(element, settings.data_bg, null);
    setData(element, settings.data_bg_hidpi, null);
};

export const removeDataMultiBackground = (element, settings) => {
    setData(element, settings.data_bg_multi, null);
    setData(element, settings.data_bg_multi_hidpi, null);
};

export const removeDataAttributes = (element, settings) => {
    const removeDataFunction = removeDataFunctions[element.tagName];
    if (removeDataFunction) {
        removeDataFunction(element, settings);
        return;
    }
    removeDataBackground(element, settings);
};
