import {getData} from "./lazyload.data";

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

export const setAttributeIfNotNullOrEmpty = function(element, attrName, value) {
    if (!value) {return;}
    element.setAttribute(attrName, value);
};

export const setSources = function (element, settings) {
    const dataAttrSrcName = settings.data_src;
    const elementSrc = getData(element, dataAttrSrcName);
    const tagName = element.tagName;
    if (tagName === "IMG") {
        const dataAttrSrcSetName = settings.data_srcset;
        const elementSrcSet = getData(element, dataAttrSrcSetName);
        const parent = element.parentNode;
        if (parent && parent.tagName === "PICTURE") {
            setSourcesInChildren(parent, "srcset", dataAttrSrcSetName);
        }
        setAttributeIfNotNullOrEmpty(element, "srcset", elementSrcSet);
        setAttributeIfNotNullOrEmpty(element, "src", elementSrc);
        return;
    }
    if (tagName === "IFRAME") {
        setAttributeIfNotNullOrEmpty(element, "src", elementSrc);
        return;
    }
    if (tagName === "VIDEO") {
        setSourcesInChildren(element, "src", dataAttrSrcName);
        setAttributeIfNotNullOrEmpty(element, "src", elementSrc);
        return;
    }
    if (elementSrc) {
        element.style.backgroundImage = `url("${elementSrc}")`;
    }
};