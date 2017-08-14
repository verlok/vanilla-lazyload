import setSources from "./lazyload.setSources";

const eventListener = "EventListener";

const callCallback = function (callback, argument) {
    if (callback) { callback(argument); }
};

const addRemoveListeners = function(element, addRemove, loadHandler, errorHandler) {
    element[addRemove + eventListener]("load", loadHandler);
    element[addRemove + eventListener]("error", errorHandler);
}

 const addClass = function(element, className) {
    element.classList.add(className);
}

 const removeClass = function(element, className) {
    element.classList.remove(className);
}

const onError = function (event, settings) {
    // As this method is asynchronous, it must be protected against calls after destroy()
    if (!settings) {
        return;
    }
    const element = event.target;

    addRemoveListeners(element, "remove", onLoad, onError);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_error);
    callCallback(settings.callback_error, element); // Calling ERROR callback
};

const onLoad = function (event, settings) {
    // As this method is asynchronous, it must be protected against calls after destroy()
    if (!settings) {
        return;
    }
    const element = event.target;

    addRemoveListeners(element, "remove", onLoad, onError);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_loaded);
    callCallback(settings.callback_load, element); // Calling LOAD callback
};

// Stop watching and load the image
export default function (element, settings) {
    if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
        addRemoveListeners(element, "add", onLoad, onError);
        addClass(element, settings.class_loading);
    }
    setSources(element, settings);
    element.dataset.wasProcessed = true;
    callCallback(settings.callback_set, element);
};