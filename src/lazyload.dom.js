import { excludeElementsWithStatus } from "./lazyload.purge";

const queryElements = settings => settings.container.querySelectorAll(settings.elements_selector);

export const nodeSetToArray = nodeSet => Array.prototype.slice.call(nodeSet);

export const getElements = (elements, settings) =>
    excludeElementsWithStatus(nodeSetToArray(elements || queryElements(settings)));
