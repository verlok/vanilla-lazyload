const getTopOffset = function (element) {
    return element.getBoundingClientRect().top + window.pageYOffset - element.ownerDocument.documentElement.clientTop;
};

const isBelowViewport = function (element, threshold) {
    const fold = window.innerHeight + window.pageYOffset;
    return fold <= getTopOffset(element) - threshold;
};

const getLeftOffset = function (element) {
    return element.getBoundingClientRect().left + window.pageXOffset - element.ownerDocument.documentElement.clientLeft;
};

const isAtRightOfViewport = function (element, threshold) {
    const documentWidth = window.innerWidth;
    const fold = documentWidth + window.pageXOffset;
    return fold <= getLeftOffset(element) - threshold;
};

const isAboveViewport = function (element, threshold) {
    const fold = window.pageYOffset;
    return fold >= getTopOffset(element) + threshold + element.offsetHeight;
};

const isAtLeftOfViewport = function (element, threshold) {
    const fold = window.pageXOffset;
    return fold >= getLeftOffset(element) + threshold + element.offsetWidth;
};

export default function (element, threshold) {
    return !isBelowViewport(element, threshold) &&
        !isAboveViewport(element, threshold) &&
        !isAtRightOfViewport(element, threshold) &&
        !isAtLeftOfViewport(element, threshold);
};