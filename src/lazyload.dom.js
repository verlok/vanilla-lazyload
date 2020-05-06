import { hasEmptyStatus, hasStatusError } from "./lazyload.data";

export const toArray = (nodeSet) => Array.prototype.slice.call(nodeSet);

export const queryElements = (settings) =>
    settings.container.querySelectorAll(settings.elements_selector);

export const excludeManagedElements = (elements) => toArray(elements).filter(hasEmptyStatus);

export const hasError = (element) => hasStatusError(element);
export const filterErrorElements = (elements) => toArray(elements).filter(hasError);

export const getElementsToLoad = (elements, settings) =>
    excludeManagedElements(elements || queryElements(settings));
