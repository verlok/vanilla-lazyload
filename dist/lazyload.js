var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.LazyLoad = factory();
})(this, function () {
    'use strict';

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

    var purgeElements = function purgeElements(elements) {
        return elements.filter(function (element) {
            return !element.dataset.wasProcessed;
        });
    };

    /* Creates instance and notifies it through the window element */
    var createInstance = function createInstance(classObj, options) {
        var instance = new classObj(options);
        var event = new CustomEvent("LazyLoad::Initialized", { detail: { instance: instance } });
        window.dispatchEvent(event);
    };

    /* Auto initialization of one or more instances of lazyload, depending on the 
        options passed in (plain object or an array) */
    var autoInitialize = function autoInitialize(classObj, options) {
        var optsLength = options.length;
        if (!optsLength) {
            // Plain object
            createInstance(classObj, options);
        } else {
            // Array of objects
            for (var i = 0; i < optsLength; i++) {
                createInstance(classObj, options[i]);
            }
        }
    };

    /*
     * Constructor
     */

    var LazyLoad = function LazyLoad(instanceSettings) {
        var _this = this;

        this._settings = _extends({}, defaultSettings, instanceSettings);
        var settings = this._settings;
        if ("IntersectionObserver" in window) {
            var onIntersection = function onIntersection(entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    var element = entry.target;
                    revealElement(element, settings);
                    _this._observer.unobserve(element);
                });
                _this._elements = purgeElements(_this._elements);
            };
            this._observer = new IntersectionObserver(onIntersection, {
                root: settings.container === document ? null : settings.container,
                rootMargin: settings.threshold + "px"
            });
        }
        this.update();
    };

    LazyLoad.prototype = {
        update: function update() {
            var _this2 = this;

            var settings = this._settings;
            var elements = settings.container.querySelectorAll(settings.elements_selector);

            this._elements = purgeElements(Array.prototype.slice.call(elements)); // nodeset to array for IE compatibility
            if (this._observer) {
                this._elements.forEach(function (element) {
                    _this2._observer.observe(element);
                });
                return;
            }
            // Fallback: load all elements at once
            this._elements.forEach(function (element) {
                revealElement(element, settings);
            });
            this._elements = purgeElements(this._elements);
        },

        destroy: function destroy() {
            var _this3 = this;

            if (this._observer) {
                purgeElements(this._elements).forEach(function (element) {
                    _this3._observer.unobserve(element);
                });
                this._observer = null;
            }
            this._elements = null;
            this._settings = null;
        }
    };

    /* Automatic instances creation if required (useful for async script loading!) */
    var autoInitOptions = window.lazyLoadOptions;
    if (autoInitOptions) {
        autoInitialize(LazyLoad, autoInitOptions);
    }

    return LazyLoad;
});
