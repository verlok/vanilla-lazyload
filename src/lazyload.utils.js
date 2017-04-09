export const _isBot = !("onscroll" in window) || /glebot/.test(navigator.userAgent);

export const _getTopOffset = function (element) {
    return element.getBoundingClientRect().top + window.pageYOffset - element.ownerDocument.documentElement.clientTop;
};

export const _isBelowViewport = function (element, container, threshold) {
    const fold = (container === window) ?
        window.innerHeight + window.pageYOffset :
        _getTopOffset(container) + container.offsetHeight;
    return fold <= _getTopOffset(element) - threshold;
};

export const _getLeftOffset = function (element) {
    return element.getBoundingClientRect().left + window.pageXOffset - element.ownerDocument.documentElement.clientLeft;
};

export const _isAtRightOfViewport = function (element, container, threshold) {
    const documentWidth = window.innerWidth;
    const fold = (container === window) ?
        documentWidth + window.pageXOffset :
        _getLeftOffset(container) + documentWidth;
    return fold <= _getLeftOffset(element) - threshold;
};

export const _isAboveViewport = function (element, container, threshold) {
    const fold = (container === window) ? window.pageYOffset : _getTopOffset(container);
    return fold >= _getTopOffset(element) + threshold + element.offsetHeight;
};

export const _isAtLeftOfViewport = function (element, container, threshold) {
    const fold = (container === window) ? window.pageXOffset : _getLeftOffset(container);
    return fold >= _getLeftOffset(element) + threshold + element.offsetWidth;
};

export const _isInsideViewport = function (element, container, threshold) {
    return !_isBelowViewport(element, container, threshold) &&
        !_isAboveViewport(element, container, threshold) &&
        !_isAtRightOfViewport(element, container, threshold) &&
        !_isAtLeftOfViewport(element, container, threshold);
};

export const _callCallback = function (callback, argument) {
    if (callback) { callback(argument); }
};

/* Creates instance and notifies it through the window element */
export const _createInstance = function (options) { 
    let instance = new LazyLoad(options);
    let event = new CustomEvent("LazyLoad::Initialized", { detail: { instance } });
    window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
export const _autoInitialize = function (options) { 
    let optsLength = options.length;
    if (!optsLength) {
        // Plain object
        _createInstance(options);
    }
    else {
        // Array of objects
        for (let i = 0; i < optsLength; i++) {
            _createInstance(options[i]);
        }
    }
};

export const _setSourcesForPicture = function(element, srcsetDataAttribute) {
    const parent = element.parentElement;
    if (parent.tagName !== "PICTURE") {
        return;
    }
    for (let i = 0; i < parent.children.length; i++) {
        let pictureChild = parent.children[i];
        if (pictureChild.tagName === "SOURCE") {
            let sourceSrcset = pictureChild.getAttribute("data-" + srcsetDataAttribute);
            if (sourceSrcset) {
                pictureChild.setAttribute("srcset", sourceSrcset);
            }
        }
    }
};

export const _setSources = function(element, srcsetDataAttribute, srcDataAttribute) {
    const tagName = element.tagName;
    const elementSrc = element.getAttribute("data-" + srcDataAttribute);
    if (tagName === "IMG") {
        utils._setSourcesForPicture(element, srcsetDataAttribute);
        const imgSrcset = element.getAttribute("data-" + srcsetDataAttribute);
        if (imgSrcset) { element.setAttribute("srcset", imgSrcset); }
        if (elementSrc) { element.setAttribute("src", elementSrc); }
        return;
    }
    if (tagName === "IFRAME") {
        if (elementSrc) { element.setAttribute("src", elementSrc); }
        return;
    }
    if (elementSrc) { element.style.backgroundImage = "url(" + elementSrc + ")"; }
}