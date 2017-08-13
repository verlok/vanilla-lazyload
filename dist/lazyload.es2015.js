(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.LazyLoad = factory());
}(this, (function () { 'use strict';

    // TODO: Check is class "initial" can still be used

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
        callback_processed: null,
        observer_fallback: 1
    };

    const eventListener = "EventListener";

    const isBot = !("onscroll" in window) || /glebot/.test(navigator.userAgent);

    const callCallback = function (callback, argument) {
        if (callback) { callback(argument); }
    };

    const addRemoveListeners = function(element, addRemove, loadHandler, errorHandler) {
        element[addRemove + eventListener]("load", loadHandler);
        element[addRemove + eventListener]("error", errorHandler);
    };

    const addClass = function(element, className) {
        element.classList.add(className);
    };

    const removeClass = function(element, className) {
        element.classList.remove(className);
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

    /*
     * Constructor
     */

    const LazyLoad = function (instanceSettings) {
        this._settings = Object.assign({}, defaultSettings, instanceSettings);
        const settings = this._settings;
        if ("IntersectionObserver" in window) {
            const onIntersection = (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    let element = entry.target;
                    this._revealElement(element); 
                    this._observer.unobserve(element);
                });
            };
            this._observer = new IntersectionObserver(onIntersection, {
                root: settings.container === document ? null : settings.container,
                rootMargin: settings.threshold + "px"
            });
        }
        this.update();
    };

    // TODO: Convert settings = this._settings into {setting1, setting2} = this._settings for legibility and minification;

    LazyLoad.prototype = {

        /*
         * Private methods
         */

        _onError: function (event) {
            const settings = this._settings;
            // As this method is asynchronous, it must be protected against calls after destroy()
            if (!settings) {
                return;
            }
            const element = event.target;

            addRemoveListeners(element, "remove", this._onLoad, this._onError);
            removeClass(element, settings.class_loading);
            addClass(element, settings.class_error);
            callCallback(settings.callback_error, element); // Calling ERROR callback
        },

        _onLoad: function (event) {
            const settings = this._settings;
            // As this method is asynchronous, it must be protected against calls after destroy()
            if (!settings) {
                return;
            }
            const element = event.target;

            addRemoveListeners(element, "remove", this._onLoad, this._onError);
            removeClass(element, settings.class_loading);
            addClass(element, settings.class_loaded);
            callCallback(settings.callback_load, element); // Calling LOAD callback
        },

        // Stop watching and load the image
        _revealElement: function (element) {
            const settings = this._settings;
            if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
                addRemoveListeners(element, "add", this._onLoad.bind(this), this._onError.bind(this));
                addClass(element, settings.class_loading);
            }
            setSources(element, settings);
            element.dataset.wasProcessed = true;
            callCallback(settings.callback_set, element);
        },

        // TODO: Optimize removing double loop (for, while) -- can this function be removed at all?
        _purgeElements: function () {
            const elements = this._elements,
                elementsLength = elements.length,
                elementsToPurge = [];

            for (let i = 0; i < elementsLength; i++) {
                let element = elements[i];
                /* If the element has already been processed, skip it */
                if (element.dataset.wasProcessed) {
                    elementsToPurge.push(i);
                }
            }
            /* Removing elements to purge from this._elements. */
            while (elementsToPurge.length > 0) {
                elements.splice(elementsToPurge.pop(), 1);
            }
        },

        /* 
         * Public methods
         */

        update: function () {
            const settings = this._settings;

            // TODO: Don't convert to array, use nodeset directly
            // TODO: Make purgeElements take a nodeset and return a purged one so this._elements is assigned once

            // Converts to array the nodeset obtained querying the DOM from settings.container with elements_selector
            this._elements = Array.prototype.slice.call(settings.container.querySelectorAll(settings.elements_selector));
            this._purgeElements();

            if (this._observer) {
                this._elements.forEach(element => {
                    this._observer.observe(element);
                });
                return;
            }

            if (settings.observer_fallback === 1) {
                this._elements.forEach(element => {
                    this._revealElement(element, settings);
                });
            }

        },

        destroy: function () {
            if (this._observer) {
                this._purgeElements();
                this._elements.forEach(element => {
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
