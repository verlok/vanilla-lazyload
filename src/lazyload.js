import defaultSettings from "./lazyload.defaults";
import purgeElements from "./lazyload.purge";
import autoInitialize from "./lazyload.autoInitialize";
import revealElement from "./lazyload.reveal";

const LazyLoad = function (instanceSettings, elements) {
    this._settings = Object.assign({}, defaultSettings, instanceSettings);
    this._setObserver();
    this.update(elements);
};

LazyLoad.prototype = {
    _setObserver: function () {
        if (!("IntersectionObserver" in window)) {
            return;
        }

        const settings = this._settings;
        const onIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio > 0) {
                    let element = entry.target;
                    revealElement(element, settings);
                    this._observer.unobserve(element);    
                }
            });
            this._elements = purgeElements(this._elements);
        };
        this._observer = new IntersectionObserver(onIntersection, {
            root: settings.container === document ? null : settings.container,
            rootMargin: settings.threshold + "px"
        });
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
}

/* Automatic instances creation if required (useful for async script loading!) */
let autoInitOptions = window.lazyLoadOptions;
if (autoInitOptions) {
    autoInitialize(LazyLoad, autoInitOptions);
}

export default LazyLoad;