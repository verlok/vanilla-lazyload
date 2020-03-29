import { getData, setStatus } from "./lazyload.data";
import { statusLoading, statusApplied } from "./lazyload.elementStatus";

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

export const setSourcesBgFromDataSrc = (element, accessoryImg, settings, instance) => {
    const srcDataValue = getData(element, settings.data_src);
    if (!srcDataValue) return;
    element.style.backgroundImage = `url("${srcDataValue}")`;
    accessoryImg.setAttribute("src", srcDataValue);
    setStatus(element, statusLoading);
    increaseLoadingCount(instance);
};

// NOTE: THE ACCESSORY IMAGE TRICK CANNOT BE DONE WITH data-bg
// BECAUSE INSIDE ITS VALUE THERE COULD BE 0, 1 or MULTIPLE IMAGES
export const setSourcesBgFromDataBg = (element, settings) => {
    const bgDataValue = getData(element, settings.data_bg);
    if (!bgDataValue) return;
    element.style.backgroundImage = bgDataValue;
    setStatus(element, statusApplied);
};

const setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
};

export const setSources = (element, accessoryImg, settings, instance) => {
    const tagName = element.tagName;
    const setSourcesFunction = setSourcesFunctions[tagName];
    if (setSourcesFunction) {
        setSourcesFunction(element, settings);
        increaseLoadingCount(instance);
    } else {
        setSourcesBgFromDataSrc(element, accessoryImg, settings, instance);
        setSourcesBgFromDataBg(element, settings);
    }
};
