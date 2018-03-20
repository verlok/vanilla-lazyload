(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LazyLoad = factory());
}(this, (function () { 'use strict';

var getInstanceSettings = (customSettings) => {
    const defaultSettings = {
        elements_selector: "img",
        container: document,
        threshold: 300,
        data_src: "src",
        data_srcset: "srcset",
        class_loading: "loading",
        class_loaded: "loaded",
        class_error: "error",
        callback_load: null,
        callback_error: null,
        callback_set: null,
        callback_enter: null
    };

    return Object.assign({}, defaultSettings, customSettings);
};

const dataPrefix = "data-";

const getData = (element, attribute) => {
    return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
    return element.setAttribute(dataPrefix + attribute, value);
};

var purgeElements = function (elements) {
    return elements.filter((element) => {
        return !getData(element, "was-processed");
    });
};

/* Creates instance and notifies it through the window element */
const createInstance = function (classObj, options) { 
    var event;
    let eventString = "LazyLoad::Initialized";
    let instance = new classObj(options);
    try {
        // Works in modern browsers
        event = new CustomEvent(eventString, { detail: { instance } });
    }
    catch(err) {
        // Works in Internet Explorer (all versions)
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventString, false, false, { instance });
    }
    window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
var autoInitialize = function (classObj, options) {
    if (!options.length) {
        // Plain object
        createInstance(classObj, options);
    } else {
        // Array of objects
        for (let i = 0, optionsItem; optionsItem = options[i]; i += 1) {
            createInstance(classObj, optionsItem);
        }
    }
};

const setSourcesForPicture = function (element, settings) {
    const {data_srcset: dataSrcSet} = settings;
    const parent = element.parentNode;
    if (parent.tagName !== "PICTURE") {
        return;
    }
    for (let i = 0, pictureChild; pictureChild = parent.children[i]; i += 1) {
        if (pictureChild.tagName === "SOURCE") {
            let sourceSrcset = getData(pictureChild, dataSrcSet);
            if (sourceSrcset) {
                pictureChild.setAttribute("srcset", sourceSrcset);
            }
        }
    }
};

const setSources = function (element, settings) {
    const {data_src: dataSrc, data_srcset: dataSrcSet} = settings;
    const tagName = element.tagName;
    const elementSrc = getData(element, dataSrc);
    if (tagName === "IMG") {
        setSourcesForPicture(element, settings);
        const imgSrcset = getData(element, dataSrcSet);
        if (imgSrcset) {
            element.setAttribute("srcset", imgSrcset);
        }
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (tagName === "IFRAME") {
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (elementSrc) {
        element.style.backgroundImage = `url("${elementSrc}")`;
    }
};

const runningOnBrowser = (typeof window !== "undefined");

const supportsIntersectionObserver = runningOnBrowser && ("IntersectionObserver" in window);

const supportsClassList = runningOnBrowser && ("classList" in document.createElement("p"));

const addClass = (element, className) => {
    if (supportsClassList) {
        element.classList.add(className);
        return;
    }
    element.className += (element.className ? " " : "") + className;
};

const removeClass = (element, className) => {
    if (supportsClassList) {
        element.classList.remove(className);
        return;
    }
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
};

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
    };
    const onError = (event) => {
        onEvent(event, false, settings);
        removeListeners(element, onLoad, onError);
    };
    element.addEventListener(loadString, onLoad);
    element.addEventListener(errorString, onError);
};

const onEvent = function (event, success, settings) {
    const element = event.target;
    removeClass(element, settings.class_loading);
    addClass(element, (success ? settings.class_loaded : settings.class_error)); // Setting loaded or error class
    callCallback(success ? settings.callback_load : settings.callback_error, element); // Calling loaded or error callback
};

var revealElement = function (element, settings) {
    callCallback(settings.callback_enter, element);
    if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
        addOneShotListeners(element, settings);
        addClass(element, settings.class_loading);
    }
    setSources(element, settings);
    setData(element, "was-processed", true);
    callCallback(settings.callback_set, element);
};

/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
const isIntersecting = (element) => element.isIntersecting || element.intersectionRatio > 0;

const LazyLoad = function (customSettings, elements) {
    this._settings = getInstanceSettings(customSettings);
    this._setObserver();
    this.update(elements);
};

LazyLoad.prototype = {
    _setObserver: function () {
        if (!supportsIntersectionObserver) {
            return;
        }

        const settings = this._settings;
        const observerSettings = {
            root: settings.container === document ? null : settings.container,
            rootMargin: settings.threshold + "px"
        };
        const revealIntersectingElements = (entries) => {
            entries.forEach(entry => {
                if (isIntersecting(entry)) {
                    let element = entry.target;
                    revealElement(element, this._settings);
                    this._observer.unobserve(element);
                }
            });
            this._elements = purgeElements(this._elements);
        };
        this._observer = new IntersectionObserver(revealIntersectingElements, observerSettings);
    },

    update: function (elements) {
        const settings = this._settings;
        const nodeSet = elements || settings.container.querySelectorAll(settings.elements_selector);

        this._elements = purgeElements(Array.prototype.slice.call(nodeSet)); // nodeset to array for IE compatibility
        if (this._observer) {
            this._elements.forEach(element => {
                this._observer.observe(element);
            });
            return;
        }
        // Fallback: load all elements at once
        this._elements.forEach(element => {
            revealElement(element, settings);
        });
        this._elements = purgeElements(this._elements);
    },

    destroy: function () {
        if (this._observer) {
            purgeElements(this._elements).forEach(element => {
                this._observer.unobserve(element);
            });
            this._observer = null;
        }
        this._elements = null;
        this._settings = null;
    }
};

/* Automatic instances creation if required (useful for async script loading!) */
let autoInitOptions = window.lazyLoadOptions;
if (runningOnBrowser && autoInitOptions) {
    autoInitialize(LazyLoad, autoInitOptions);
}

return LazyLoad;

})));
