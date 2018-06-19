import {getData} from "./lazyload.data";

export const setSourcesForPicture = function (element, settings) {
    const {data_srcset: dataSrcSet} = settings;
    const parent = element.parentNode;
    if (!parent || parent.tagName !== "PICTURE") {
        return;
    }
    setSourcesInChildren(parent, "srcset", dataSrcSet);
};

export const setSourcesInChildren = function(parentTag, attrName, dataAttrName) {
    for (let i = 0, childTag; childTag = parentTag.children[i]; i += 1) {
        if (childTag.tagName === "SOURCE") {
            let attributeValue = getData(childTag, dataAttrName);
            if (attributeValue) {
                childTag.setAttribute(attrName, attributeValue);
            }
        }
    }
};

export const setSourcesForVideo = function (element, settings) {
    const {data_src: dataSrc} = settings;
    setSourcesInChildren(element, "src", dataSrc);
}

export const setSources = function (element, settings) {
    const {data_src: dataSrc, data_srcset: dataSrcSet} = settings;
    const tagName = element.tagName;
    const elementSrc = getData(element, dataSrc);
    if (tagName === "IMG") {
        setSourcesForPicture(element, settings);
        const imgSrcset = getData(element, dataSrcSet);
        if (imgSrcset) {
            element.setAttribute("srcset", imgSrcset);
        }
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (tagName === "VIDEO") {
        setSourcesForVideo(element, settings);
        return; 
    }
    if (tagName === "IFRAME") {
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (elementSrc) {
        element.style.backgroundImage = `url("${elementSrc}")`;
    }
};