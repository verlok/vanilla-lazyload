const dataPrefix = "data-";
const processedDataName = "was-processed";
const processedDataValue = "true";

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

export const setWasProcessedData = element =>
	setData(element, processedDataName, processedDataValue);

export const getWasProcessedData = element =>
	getData(element, processedDataName) === processedDataValue;
