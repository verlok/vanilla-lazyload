const eventListener = "EventListener";

export const isBot = !("onscroll" in window) || /glebot/.test(navigator.userAgent);

export const callCallback = function (callback, argument) {
    if (callback) { callback(argument); }
};

export const addRemoveListeners = function(element, addRemove, loadHandler, errorHandler) {
    element[addRemove + eventListener]("load", loadHandler);
    element[addRemove + eventListener]("error", errorHandler);
}

export const addClass = function(element, className) {
    element.classList.add(className);
}

export const removeClass = function(element, className) {
    element.classList.remove(className);
}

export const purgeElements = function (elements) {
    const purgedElements = [];
    
    for (let element, i = 0; element = elements[i]; i++) {
        if (!element.dataset.wasProcessed) {
            purgedElements.push(element);
        }
    }
    return purgedElements;
}