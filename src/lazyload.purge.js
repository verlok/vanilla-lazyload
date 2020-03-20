import { hasStatus } from "./lazyload.data";

export const excludeElementsWithStatus = elements => {
    return elements.filter(element => !hasStatus(element));
};

export const excludeOneElement = (elements, elementToExclude) => {
    return elements.filter(element => element !== elementToExclude);
};
