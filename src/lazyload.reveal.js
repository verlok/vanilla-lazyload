import {setSources} from "./lazyload.setSources";
import {setData} from "./lazyload.data";

const callCallback = function (callback, argument) {
    if (callback) {
        callback(argument);
    }
};

const loadString = "load";
const errorString = "error";

const removeListeners = function(element, loadHandler, errorHandler) {
    element.removeEventListener(loadString, loadHandler);
    element.removeEventListener(errorString, errorHandler);
};

const addOneShotListeners = function(element, settings) {
    const onLoad = (event) => {
        onEvent(event, true, settings);
        removeListeners(element, onLoad, onError);
    }
    const onError = (event) => {
        onEvent(event, false, settings);
        removeListeners(element, onLoad, onError);
    }
    element.addEventListener(loadString, onLoad);
    element.addEventListener(errorString, onError);
};

const onEvent = function (event, success, settings) {
    const element = event.target;
    element.classList.remove(settings.class_loading);

    element.classList.add(
        // Setting loaded or error class
        success ? settings.class_loaded : settings.class_error
    );

    callCallback(success ? settings.callback_load : settings.callback_error, element); // Calling loaded or error callback
}

export default function (element, settings) {
    if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
        addOneShotListeners(element, settings);
        element.classList.add(settings.class_loading);
    }
    setSources(element, settings);
    setData(element, "was-processed", true);
    callCallback(settings.callback_set, element);
};
