import { getInstanceSettings } from "./lazyload.defaults";
import { autoInitialize } from "./lazyload.autoInitialize";
import { load } from "./lazyload.load";
import { setObserver } from "./lazyload.intersectionObserver";
import { isBot, runningOnBrowser } from "./lazyload.environment";
import { shouldUseNative, loadAllNative } from "./lazyload.native";
import { getElements } from "./lazyload.dom";
import { setOnlineCheck } from "./lazyload.online";
import { setStatus, resetStatus } from "./lazyload.data";

const LazyLoad = function(customSettings, elements) {
    this._settings = getInstanceSettings(customSettings);
    this.loadingCount = 0;
    setObserver(this);
    setOnlineCheck(this);
    this.update(elements);
};

LazyLoad.prototype = {
    update: function(elements) {
        var settings = this._settings;
        this._elements = getElements(elements, settings);
        if (isBot || !this._observer) {
            this.loadAll();
            return;
        }
        if (shouldUseNative(settings)) {
            loadAllNative(this);
            return;
        }
        this._elements.forEach(element => {
            this._observer.observe(element);
            console.log("Observing", element);
            setStatus(element, "observing");
        });
    },

    destroy: function() {
        if (this._observer) {
            this._elements.forEach(element => {
                this._observer.unobserve(element);
                resetStatus(element);
            });
            this._observer = null;
        }
        this._elements = null;
        this._settings = null;
    },

    load: function(element) {
        load(element, this);
    },

    loadAll: function() {
        this._elements.forEach(element => {
            load(element, this);
        });
    }
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
    autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
