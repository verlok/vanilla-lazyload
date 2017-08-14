import setSources from "./lazyload.setSources";

const callCallback = function (callback, argument) {
    if (callback) {
        callback(argument);
    }
};

const addOneShotListener = function(element, eventType, handler, settings) {
    const augmentedHandler = (event) => {
        handler(event, settings);
        element.removeEventListener(eventType, augmentedHandler);
    }
    element.addEventListener(eventType, augmentedHandler);
};

const addClass = function (element, className) {
    element.classList.add(className);
};

const removeClass = function (element, className) {
    element.classList.remove(className);
};

const onEvent = function (event, settings, loaded) {
    const element = event.target;
    removeClass(element, settings.class_loading);
    addClass(element, loaded ? settings.class_loaded : settings.class_error); // Setting loaded or error class
    callCallback(loaded ? settings.callback_load : settings.callback_error, element); // Calling loaded or error callback
}

const onError = function (event, settings) {
    onEvent(event, settings, false);
};

const onLoad = function (event, settings) {
    onEvent(event, settings, true);
};

export default function (element, settings) {
    if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
        addOneShotListener(element, "load", onLoad, settings);
        addOneShotListener(element, "error", onError, settings);
        addClass(element, settings.class_loading);
    }
    setSources(element, settings);
    element.dataset.wasProcessed = true;
    callCallback(settings.callback_set, element);
};