import setSources from "./lazyload.setSources";

const callCallback = function (callback, argument) {
    if (callback) {
        callback(argument);
    }
};

const addOneShotListener = function(element, forSuccess, settings) {
    const eventType = forSuccess ? "load" : "error";
    const handler = (event) => { onEvent(event, forSuccess, settings) };
    const augmentedHandler = (event) => {
        handler(event, settings);
        element.removeEventListener(eventType, augmentedHandler);
    }
    element.addEventListener(eventType, augmentedHandler);
};

const onEvent = function (event, success, settings) {
    const element = event.target;
    element.classList.remove(settings.class_loading);
    element.classList.add(success ? settings.class_loaded : settings.class_error); // Setting loaded or error class
    callCallback(success ? settings.callback_load : settings.callback_error, element); // Calling loaded or error callback
}

export default function (element, settings) {
    if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
        addOneShotListener(element, true, settings);
        addOneShotListener(element, false, settings);
        element.classList.add(settings.class_loading);
    }
    setSources(element, settings);
    element.dataset.wasProcessed = true;
    callCallback(settings.callback_set, element);
};