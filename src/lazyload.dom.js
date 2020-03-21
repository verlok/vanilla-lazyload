import { hasStatus } from "./lazyload.data";

/* export const excludeDone = elements => {
    return elements.filter(element => !hasStatus(element));
}; */

/* export const getElements = (givenNodeset, settings) =>
    excludeElementsWithStatus(nodeSetToArray(givenNodeset || queryElements(settings)));
 */

export const queryElements = settings =>
    settings.container.querySelectorAll(settings.elements_selector);

export const toArray = nodeSet => Array.prototype.slice.call(nodeSet);
