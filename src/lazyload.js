import { getInstanceSettings } from "./lazyload.defaults";
import { autoInitialize } from "./lazyload.autoInitialize";
import { load } from "./lazyload.load";
import { setObserver } from "./lazyload.intersectionObserver";
import { isBot, runningOnBrowser } from "./lazyload.environment";
import { shouldUseNative, loadAllNative } from "./lazyload.native";
import { setOnlineCheck } from "./lazyload.online";
import { setStatus } from "./lazyload.data";
import { toArray, queryElements } from "./lazyload.dom";

import { excludeElementsWithStatus } from "./lazyload.purge";

const LazyLoad = function(customSettings, elements) {
    this._settings = getInstanceSettings(customSettings);
    this.loadingCount = 0;
    setObserver(this);
    setOnlineCheck(this);
    this.update(elements);
};

/* export const getElements = (givenNodeset, settings) =>
    excludeElementsWithStatus(nodeSetToArray(givenNodeset || queryElements(settings)));
 */

const observeElements = (observer, elements) => {
    toArray(elements).forEach(element => {
        observer.observe(element);
        setStatus(element, "observing");
    });
};

LazyLoad.prototype = {
    update: function(givenNodeset) {
        const settings = this._settings;
        const elements = givenNodeset || queryElements(settings);
        // TODO: should I excludeElementsWithStatus == some status
        // It works anyway, but it's probably better to exclude some
        // for performance reasons. -- IMPORTANT: Exclude all
        // statuses but "observing"
        this.itemsToLoad = elements.length;
        console.log("Update", "ItemsToLoad = ", this.itemsToLoad);

        if (isBot || !this._observer) {
            this.loadAll(elements);
            return;
        }
        if (shouldUseNative(settings)) {
            loadAllNative(elements, this);
            return;
        }
        observeElements(this._observer, elements);
    },

    destroy: function() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        this.loadingCount = null;
        this.itemsToLoad = null;
        console.log("Destroyed", "ItemsToLoad = ", this.itemsToLoad);
        this._settings = null;
        this.update = null;
        this.load = null;
        this.loadAll = null;
    },

    load: function(element) {
        load(element, this);
    },

    loadAll: function(elements) {
        let elementsToLoad = elements || queryElements(settings);
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
