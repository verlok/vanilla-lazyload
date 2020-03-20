export const queryElements = settings =>
    settings.container.querySelectorAll(settings.elements_selector);

export const toArray = nodeSet => Array.prototype.slice.call(nodeSet);
