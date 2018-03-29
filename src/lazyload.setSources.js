import {getData} from "./lazyload.data";

const setSourcesForPicture = function (element, srcsetDataAttribute) {
    const parent = element.parentNode;
    if (parent && parent.tagName !== "PICTURE") {
        return;
    }
    for (let i = 0; i < parent.children.length; i++) {
        let pictureChild = parent.children[i];
        if (pictureChild.tagName === "SOURCE") {
            let sourceSrcset = getData(pictureChild, srcsetDataAttribute);
            if (sourceSrcset) {
                pictureChild.setAttribute("srcset", sourceSrcset);
            }
        }
    }
};

export default function (element, srcsetDataAttribute, srcDataAttribute) {
    const tagName = element.tagName;
    const elementSrc = getData(element, srcDataAttribute);
    if (tagName === "IMG") {
        setSourcesForPicture(element, srcsetDataAttribute);
        const imgSrcset = getData(element, srcsetDataAttribute);
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