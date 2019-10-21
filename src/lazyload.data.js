const dataPrefix = "data-";
const processedDataName = "was-processed";
const timeoutDataName = "ll-timeout";
const trueString = "true";

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

export const resetWasProcessedData = element =>
	setData(element, processedDataName, null);

export const setWasProcessedData = element =>
	setData(element, processedDataName, trueString);

export const getWasProcessedData = element =>
	getData(element, processedDataName) === trueString;

export const setTimeoutData = (element, value) =>
	setData(element, timeoutDataName, value);

export const getTimeoutData = element => getData(element, timeoutDataName);
