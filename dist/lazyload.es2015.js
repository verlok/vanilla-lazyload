(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.LazyLoad = factory());
}(this, (function () { 'use strict';

    // TODO: Check if class "initial" can still be used

    var defaultSettings = {
        elements_selector: "img",
        container: document,
        threshold: 300,
        data_src: "original",
        data_srcset: "originalSet",
        class_loading: "loading",
        class_loaded: "loaded",
        class_error: "error",
        class_initial: "initial",
        callback_load: null,
        callback_error: null,
        callback_set: null,
        callback_processed: null
    };

    var purgeElements = function (elements) {
        return elements.filter((element) => {
            return !element.dataset.wasProcessed;
        });
    };

    /* Creates instance and notifies it through the window element */
    const createInstance = function (classObj, options) { 
        let instance = new classObj(options);
        let event = new CustomEvent("LazyLoad::Initialized", { detail: { instance } });
        window.dispatchEvent(event);
    };

    /* Auto initialization of one or more instances of lazyload, depending on the 
        options passed in (plain object or an array) */
    var autoInitialize = function (classObj, options) { 
        let optsLength = options.length;
        if (!optsLength) {
            // Plain object
            createInstance(classObj, options);
        }
        else {
            // Array of objects
            for (let i = 0; i < optsLength; i++) {
                createInstance(classObj, options[i]);
            }
        }
    };

    const setSourcesForPicture = function (element, settings) {
        const {dataSrcSet} = settings;
        const parent = element.parentElement;
        if (parent.tagName !== "PICTURE") {
            return;
        }
        for (let i = 0; i < parent.children.length; i++) {
            let pictureChild = parent.children[i];
            if (pictureChild.tagName === "SOURCE") {
                let sourceSrcset = pictureChild.dataset[dataSrcSet];
                if (sourceSrcset) {
                    pictureChild.setAttribute("srcset", sourceSrcset);
                }
            }
        }
    };

    var setSources = function (element, settings) {
        const {data_src: dataSrc, data_srcset: dataSrcSet} = settings;
        const tagName = element.tagName;
        const elementSrc = element.dataset[dataSrc];
        if (tagName === "IMG") {
            setSourcesForPicture(element, settings);
            const imgSrcset = element.dataset[dataSrcSet];
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
        element.classList.remove(settings.class_loading);
        element.classList.add(success ? settings.class_loaded : settings.class_error); // Setting loaded or error class
        callCallback(success ? settings.callback_load : settings.callback_error, element); // Calling loaded or error callback
    };

    var revealElement = function (element, settings) {
        if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
            addOneShotListeners(element, settings);
            element.classList.add(settings.class_loading);
        }
        setSources(element, settings);
        element.dataset.wasProcessed = true;
        callCallback(settings.callback_set, element);
    };

    const LazyLoad = function (instanceSettings) {
        this._settings = Object.assign({}, defaultSettings, instanceSettings);
        this._setObserver();
        this.update();
    };

    LazyLoad.prototype = {
        _setObserver: function () {
            if (!("IntersectionObserver" in window)) {
                return;
            }

            const settings = this._settings;
            const onIntersection = (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    let element = entry.target;
                    revealElement(element, settings);
                    this._observer.unobserve(element);
                });
                this._elements = purgeElements(this._elements);
            };
            this._observer = new IntersectionObserver(onIntersection, {
                root: settings.container === document ? null : settings.container,
                rootMargin: settings.threshold + "px"
            });
        },

        update: function () {
            const settings = this._settings;
            const elements = settings.container.querySelectorAll(settings.elements_selector);

            this._elements = purgeElements(Array.prototype.slice.call(elements)); // nodeset to array for IE compatibility
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
    if (autoInitOptions) {
        autoInitialize(LazyLoad, autoInitOptions);
    }

    return LazyLoad;

})));
