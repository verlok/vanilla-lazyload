import { statusObserved, statusError } from "./lazyload.elementStatus";

const dataPrefix = "data-";
const statusDataName = "ll-status";
const timeoutDataName = "ll-timeout";

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

export const resetStatus = element => setData(element, statusDataName, null);

export const setStatus = (element, status) => setData(element, statusDataName, status);

export const hasAnyStatus = element => getData(element, statusDataName) !== null;

export const hasStatusObserved = element => getData(element, statusDataName) === statusObserved;

export const hasStatusError = element => getData(element, statusDataName) === statusError;

export const setTimeoutData = (element, value) => setData(element, timeoutDataName, value);

export const getTimeoutData = element => getData(element, timeoutDataName);
