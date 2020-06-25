import { statusError, statusLoading, statusApplied, statusNative, statusLoaded } from "./lazyload.elementStatus";

const dataPrefix = "data-";
const statusDataName = "ll-status";

export const getData = (element, attribute) => {
    return element.getAttribute(dataPrefix + attribute);
};

export const setData = (element, attribute, value) => {
    var attrName = dataPrefix + attribute;
    if (value === null) {
        element.removeAttribute(attrName);
        return;
    }
    element.setAttribute(attrName, value);
};

export const getStatus = (element) => getData(element, statusDataName);
export const setStatus = (element, status) => setData(element, statusDataName, status);
export const resetStatus = (element) => setStatus(element, null);

export const hasEmptyStatus = (element) => getStatus(element) === null;
export const hasStatusLoading = (element) => getStatus(element) === statusLoading;
export const hasStatusError = (element) => getStatus(element) === statusError;
export const hasStatusNative = (element) => getStatus(element) === statusNative;

const statusesAfterLoading = [statusLoading, statusLoaded, statusApplied, statusError];
export const hadStartedLoading = (element) => (statusesAfterLoading.indexOf(getStatus(element)) >= 0);
