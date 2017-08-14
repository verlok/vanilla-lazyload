import defaultSettings from "./lazyload.defaults";
import {
    isBot,
    callCallback,
    addRemoveListeners,
    addClass,
    removeClass,
    purgeElements
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
            this._elements = purgeElements(this._elements);
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

    /* 
     * Public methods
     */

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
            this._revealElement(element, settings);
        });
        this._elements = purgeElements(this._elements);
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