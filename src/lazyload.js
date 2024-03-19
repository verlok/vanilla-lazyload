import { getExtendedSettings } from "./defaults";
import { autoInitialize } from "./autoInitialize";
import { load } from "./load";
import { setObserver, updateObserver } from "./intersectionObserver";
import { isBot, runningOnBrowser } from "./environment";
import { loadAllNative, shouldUseNative } from "./native";
import { resetOnlineCheck, setOnlineCheck } from "./online";
import { getElementsToLoad, queryElements } from "./dom";
import { resetStatus } from "./data";
import { setToLoadCount } from "./counters";
import { unobserve } from "./unobserve";
import { restore } from "./restore";
import { deleteOriginalAttrs } from "./originalAttributes";

const LazyLoad = function(customSettings, elements) {
  const settings = getExtendedSettings(customSettings);
  this._settings = settings;
  this.loadingCount = 0;
  setObserver(settings, this);
  setOnlineCheck(settings, this);
  this.update(elements);
};

LazyLoad.prototype = {
  update: function(givenNodeset) {
    const settings = this._settings;
    const elementsToLoad = getElementsToLoad(givenNodeset, settings);
    setToLoadCount(this, elementsToLoad.length);

    if (isBot) {
      this.loadAll(elementsToLoad);
      return;
    }
    if (shouldUseNative(settings)) {
      loadAllNative(elementsToLoad, settings, this);
      return;
    }

    updateObserver(this._observer, elementsToLoad);
  },

  destroy: function() {
    // Observer
    if (this._observer) {
      this._observer.disconnect();
    }
    // Clean handlers
    resetOnlineCheck(this);
    // Clean custom attributes on elements
    queryElements(this._settings).forEach((element) => {
      deleteOriginalAttrs(element);
    });
    // Delete all internal props
    delete this._observer;
    delete this._settings;
    delete this._onlineHandler;
    delete this.loadingCount;
    delete this.toLoadCount;
  },

  loadAll: function(elements) {
    const settings = this._settings;
    const elementsToLoad = getElementsToLoad(elements, settings);
    elementsToLoad.forEach((element) => {
      unobserve(element, this);
      load(element, settings, this);
    });
  },

  restoreAll: function() {
    const settings = this._settings;
    queryElements(settings).forEach((element) => {
      restore(element, settings);
    });
  }
};

LazyLoad.load = (element, customSettings) => {
  const settings = getExtendedSettings(customSettings);
  load(element, settings);
};

LazyLoad.resetStatus = (element) => {
  resetStatus(element);
};

// Automatic instances creation if required (useful for async script loading)
if (runningOnBrowser) {
  autoInitialize(LazyLoad, window.lazyLoadOptions);
}

export default LazyLoad;
