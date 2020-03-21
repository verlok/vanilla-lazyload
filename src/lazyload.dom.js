import { hasAnyStatus, hasStatusObserved } from "./lazyload.data";

export const toArray = nodeSet => Array.prototype.slice.call(nodeSet);

export const queryElements = settings =>
    settings.container.querySelectorAll(settings.elements_selector);

const isToManage = element => !hasAnyStatus(element) || hasStatusObserved(element);

export const excludeManagedElements = elements => toArray(elements).filter(isToManage);
