const dataPrefix = "data-";
const processedDataName = "was-processed";
const processedDataValue = "true";

export const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

export const setData = (element, attribute, value) => {
	return element.setAttribute(dataPrefix + attribute, value);
};

export const setWasProcessed = element =>
	setData(element, processedDataName, processedDataValue);

export const getWasProcessed = element =>
	getData(element, processedDataName) === processedDataValue;
