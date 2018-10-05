import { getWasProcessedData } from "./lazyload.data";

export const purgeProcessedElements = elements => {
	return elements.filter(element => !getWasProcessedData(element));
};

export const purgeOneElement = (elements, elementToPurge) => {
	return elements.filter(element => element !== elementToPurge);
};
