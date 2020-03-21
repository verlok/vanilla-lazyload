import { getInstanceSettings } from "./lazyload.defaults";
import { autoInitialize } from "./lazyload.autoInitialize";
import { load } from "./lazyload.load";
import { setObserver, observeElements, resetObserver } from "./lazyload.intersectionObserver";
import { isBot, runningOnBrowser } from "./lazyload.environment";
import { shouldUseNative, loadAllNative } from "./lazyload.native";
import { setOnlineCheck } from "./lazyload.online";
import { toArray, queryElements, excludeManagedElements } from "./lazyload.dom";

const LazyLoad = function(customSettings, elements) {
    this._settings = getInstanceSettings(customSettings);
    this.loadingCount = 0;
    setObserver(this);
    setOnlineCheck(this);
    this.update(elements);
};

LazyLoad.prototype = {
    update: function(givenNodeset) {
        const settings = this._settings;
        const elements = givenNodeset || queryElements(settings);
        const elementsToLoad = excludeManagedElements(elements);
        this.itemsToLoad = elementsToLoad.length;
        console.log("Update", "ItemsToLoad = ", this.itemsToLoad);

        if (isBot || !this._observer) {
            this.loadAll(elementsToLoad);
            return;
        }
        if (shouldUseNative(settings)) {
            loadAllNative(elementsToLoad, this);
            return;
        }

        resetObserver(this._observer);
        observeElements(this._observer, elementsToLoad);
    },

    destroy: function() {
        // Observer
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        // Public properties
        this.loadingCount = null;
        this.itemsToLoad = null;
        console.log("Destroyed", "ItemsToLoad = ", this.itemsToLoad);
        this._settings = null;
        // Public methods
        this.update = null;
        this.load = null;
        this.loadAll = null;
    },

    load: function(element) {
        load(element, this);
    },

    loadAll: function(givenElements) {
        // TODO: Think again... DRY!
        const elements = givenElements || queryElements(settings);
        const elementsToLoad = excludeManagedElements(elements);
        toArray(elementsToLoad).forEach(element => {
            load(element, this);
        });
    }
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
    autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
