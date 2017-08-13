import defaultSettings from "./lazyload.defaults";
import {
    isBot,
    callCallback,
    addRemoveListeners,
    addClass,
    removeClass
} from "./lazyload.utils";
import autoInitialize from "./lazyload.autoInitialize";
import setSources from "./lazyload.setSources";

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
}

/* Automatic instances creation if required (useful for async script loading!) */
let autoInitOptions = window.lazyLoadOptions;
if (autoInitOptions) {
    autoInitialize(LazyLoad, autoInitOptions);
}

export default LazyLoad;