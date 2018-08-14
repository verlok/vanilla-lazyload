const dataPrefix = "data-";
const processedDataName = "was-processed";
const inViewportDataName = "in-viewport";
const trueString = "true";

export const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

export const setData = (element, attribute, value) => {
	return element.setAttribute(dataPrefix + attribute, value);
};

export const setWasProcessed = element =>
	setData(element, processedDataName, trueString);

export const getWasProcessed = element =>
	getData(element, processedDataName) === trueString;

export const setInViewport = (element, value = trueString) =>
	setData(element, inViewportDataName, value);

export const getInViewport = element =>
	getData(element, inViewportDataName) === trueString;
