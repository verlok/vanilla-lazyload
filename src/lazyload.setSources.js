const setSourcesForPicture = function (element, settings) {
    const {dataSrcSet} = settings;
    const parent = element.parentElement;
    if (parent.tagName !== "PICTURE") {
        return;
    }
    for (let i = 0; i < parent.children.length; i++) {
        let pictureChild = parent.children[i];
        if (pictureChild.tagName === "SOURCE") {
            let sourceSrcset = pictureChild.dataset[dataSrcSet];
            if (sourceSrcset) {
                pictureChild.setAttribute("srcset", sourceSrcset);
            }
        }
    }
};

export default function (element, settings) {
    const {data_src: dataSrc, data_srcset: dataSrcSet} = settings;
    const tagName = element.tagName;
    const elementSrc = element.dataset[dataSrc];
    if (tagName === "IMG") {
        setSourcesForPicture(element, settings);
        const imgSrcset = element.dataset[dataSrcSet];
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