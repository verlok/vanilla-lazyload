import defaultSettings from "./lazyload.defaults";
import purgeElements from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import setSources from "./lazyload.setSources";
import revealElement from "./lazyload.reveal";

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
}

/* Automatic instances creation if required (useful for async script loading!) */
let autoInitOptions = window.lazyLoadOptions;
if (autoInitOptions) {
    autoInitialize(LazyLoad, autoInitOptions);
}

export default LazyLoad;