var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.LazyLoad = factory();
})(this, function () {
    'use strict';

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

    var eventListener = "EventListener";

    var isBot = !("onscroll" in window) || /glebot/.test(navigator.userAgent);

    var callCallback = function callCallback(callback, argument) {
        if (callback) {
            callback(argument);
        }
    };

    var addRemoveListeners = function addRemoveListeners(element, addRemove, loadHandler, errorHandler) {
        element[addRemove + eventListener]("load", loadHandler);
        element[addRemove + eventListener]("error", errorHandler);
    };

    var addClass = function addClass(element, className) {
        element.classList.add(className);
    };

    var removeClass = function removeClass(element, className) {
        element.classList.remove(className);
    };

    var purgeElements = function purgeElements(elements) {
        var purgedElements = [];

        for (var element, i = 0; element = elements[i]; i++) {
            if (!element.dataset.wasProcessed) {
                purgedElements.push(element);
            }
        }
        return purgedElements;
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

    var setSourcesForPicture = function setSourcesForPicture(element, settings) {
        var dataSrcSet = settings.dataSrcSet;

        var parent = element.parentElement;
        if (parent.tagName !== "PICTURE") {
            return;
        }
        for (var i = 0; i < parent.children.length; i++) {
            var pictureChild = parent.children[i];
            if (pictureChild.tagName === "SOURCE") {
                var sourceSrcset = pictureChild.dataset[dataSrcSet];
                if (sourceSrcset) {
                    pictureChild.setAttribute("srcset", sourceSrcset);
                }
            }
        }
    };

    var setSources = function setSources(element, settings) {
        var dataSrc = settings.data_src,
            dataSrcSet = settings.data_srcset;

        var tagName = element.tagName;
        var elementSrc = element.dataset[dataSrc];
        if (tagName === "IMG") {
            setSourcesForPicture(element, settings);
            var imgSrcset = element.dataset[dataSrcSet];
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
            element.style.backgroundImage = 'url("' + elementSrc + '")';
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
                    _this._revealElement(element);
                    _this._observer.unobserve(element);
                });
            };
            this._observer = new IntersectionObserver(onIntersection, {
                root: settings.container === document ? null : settings.container,
                rootMargin: settings.threshold + "px"
            });
        }
        this.update();
    };

    // TODO: Convert all for i=0... < length loops to more performing loop using assignment as exiting case
    // TODO: Convert all private methods to external functions --> trim some kb, declare dependencies!

    LazyLoad.prototype = {

        /*
         * Private methods
         */

        _onError: function _onError(event) {
            var settings = this._settings;
            // As this method is asynchronous, it must be protected against calls after destroy()
            if (!settings) {
                return;
            }
            var element = event.target;

            addRemoveListeners(element, "remove", this._onLoad, this._onError);
            removeClass(element, settings.class_loading);
            addClass(element, settings.class_error);
            callCallback(settings.callback_error, element); // Calling ERROR callback
        },

        _onLoad: function _onLoad(event) {
            var settings = this._settings;
            // As this method is asynchronous, it must be protected against calls after destroy()
            if (!settings) {
                return;
            }
            var element = event.target;

            addRemoveListeners(element, "remove", this._onLoad, this._onError);
            removeClass(element, settings.class_loading);
            addClass(element, settings.class_loaded);
            callCallback(settings.callback_load, element); // Calling LOAD callback
        },

        // Stop watching and load the image
        _revealElement: function _revealElement(element) {
            var settings = this._settings;
            if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
                addRemoveListeners(element, "add", this._onLoad.bind(this), this._onError.bind(this));
                addClass(element, settings.class_loading);
            }
            setSources(element, settings);
            element.dataset.wasProcessed = true;
            callCallback(settings.callback_set, element);
        },

        /* 
         * Public methods
         */

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

            if (settings.observer_fallback === 1) {
                this._elements.forEach(function (element) {
                    _this2._revealElement(element, settings);
                });
            }
        },

        destroy: function destroy() {
            var _this3 = this;

            if (this._observer) {
                this._purgeElements();
                this._elements.forEach(function (element) {
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
