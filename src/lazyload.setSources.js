import { getData, setStatus } from "./lazyload.data";
import { statusLoading, statusApplied } from "./lazyload.elementStatus";
import { safeCallback } from "./lazyload.callback";
import { addClass } from "./lazyload.class";
import { getTempImage } from "./lazyload.tempImage";

export const increaseLoadingCount = instance => {
    if (!instance) return;
    instance.loadingCount += 1;
};

export const getSourceTags = parentTag => {
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

export const setImageAttributes = (element, settings) => {
    setAttributeIfValue(element, "sizes", getData(element, settings.data_sizes));
    setAttributeIfValue(element, "srcset", getData(element, settings.data_srcset));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const setSourcesImg = (element, settings) => {
    const parent = element.parentNode;

    if (parent && parent.tagName === "PICTURE") {
        let sourceTags = getSourceTags(parent);
        sourceTags.forEach(sourceTag => {
            setImageAttributes(sourceTag, settings);
        });
    }

    setImageAttributes(element, settings);
};

export const setSourcesIframe = (element, settings) => {
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

export const setSourcesVideo = (element, settings) => {
    let sourceTags = getSourceTags(element);
    sourceTags.forEach(sourceTag => {
        setAttributeIfValue(sourceTag, "src", getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, "poster", getData(element, settings.data_poster));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
    element.load();
};

const setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
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

export const setBackground = (element, settings, instance) => {
    const srcDataValue = getData(element, settings.data_bg); // TODO: GET 2X WHEN DEVICEPIXELRATIO >= 1.5
    if (!srcDataValue) return;
    element.style.backgroundImage = `url("${srcDataValue}")`;
    getTempImage(element).setAttribute("src", srcDataValue);
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
    const bgDataValue = getData(element, settings.data_bg_multi); // TODO: GET 2X WHEN DEVICEPIXELRATIO >= 1.5
    if (!bgDataValue) return;
    element.style.backgroundImage = bgDataValue;
    // Annotate and notify applied
    addClass(element, settings.class_applied);
    setStatus(element, statusApplied);
    safeCallback(settings.callback_applied, element, instance);
};
