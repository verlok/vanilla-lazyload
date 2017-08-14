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

    // Stop watching and load the image

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
                    revealElement(element, settings);
                    this._observer.unobserve(element);
                });
                this._elements = purgeElements(this._elements);
            };
            this._observer = new IntersectionObserver(onIntersection, {
                root: settings.container === document ? null : settings.container,
                rootMargin: settings.threshold + "px"
            });
        }
        this.update();
    };

    // TODO: Convert all private methods to external functions --> trim some kb, declare dependencies!

    LazyLoad.prototype = {
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
