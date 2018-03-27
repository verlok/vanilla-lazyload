import {getData} from "./lazyload.data";

export const setSourcesForPicture = function (element, settings) {
    const {data_srcset: dataSrcSet} = settings;
    const parent = element.parentNode;
    if (!parent || parent.tagName !== "PICTURE") {
        return;
    }
    for (let i = 0, pictureChild; pictureChild = parent.children[i]; i += 1) {
        if (pictureChild.tagName === "SOURCE") {
            let sourceSrcset = getData(pictureChild, dataSrcSet);
            if (sourceSrcset) {
                pictureChild.setAttribute("srcset", sourceSrcset);
            }
        }
    }
};

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