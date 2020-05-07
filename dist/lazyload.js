(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.LazyLoad = factory());
}(this, (function () { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var runningOnBrowser = typeof window !== "undefined";
  var isBot = runningOnBrowser && !("onscroll" in window) || typeof navigator !== "undefined" && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
  var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;
  var supportsClassList = runningOnBrowser && "classList" in document.createElement("p");
  var isHiDpi = runningOnBrowser && window.devicePixelRatio > 1;

  var defaultSettings = {
    elements_selector: "img",
    container: isBot || runningOnBrowser ? document : null,
    threshold: 300,
    thresholds: null,
    data_src: "src",
    data_srcset: "srcset",
    data_sizes: "sizes",
    data_bg: "bg",
    data_bg_hidpi: "bg-hidpi",
    data_bg_multi: "bg-multi",
    data_bg_multi_hidpi: "bg-multi-hidpi",
    data_poster: "poster",
    class_applied: "applied",
    class_loading: "loading",
    class_loaded: "loaded",
    class_error: "error",
    load_delay: 0,
    auto_unobserve: true,
    cancel_on_exit: false,
    callback_enter: null,
    callback_exit: null,
    callback_applied: null,
    callback_loading: null,
    callback_loaded: null,
    callback_error: null,
    callback_finish: null,
    callback_cancel: null,
    use_native: false
  };
  var getExtendedSettings = function getExtendedSettings(customSettings) {
    return _extends({}, defaultSettings, customSettings);
  };

  /* Creates instance and notifies it through the window element */
  var createInstance = function createInstance(classObj, options) {
    var event;
    var eventString = "LazyLoad::Initialized";
    var instance = new classObj(options);

    try {
      // Works in modern browsers
      event = new CustomEvent(eventString, {
        detail: {
          instance: instance
        }
      });
    } catch (err) {
      // Works in Internet Explorer (all versions)
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(eventString, false, false, {
        instance: instance
      });
    }

    window.dispatchEvent(event);
  };
  /* Auto initialization of one or more instances of lazyload, depending on the 
      options passed in (plain object or an array) */


  var autoInitialize = function autoInitialize(classObj, options) {
    if (!options) {
      return;
    }

    if (!options.length) {
      // Plain object
      createInstance(classObj, options);
    } else {
      // Array of objects
      for (var i = 0, optionsItem; optionsItem = options[i]; i += 1) {
        createInstance(classObj, optionsItem);
      }
    }
  };

  var statusDelayed = "delayed";
  var statusLoading = "loading";
  var statusLoaded = "loaded";
  var statusApplied = "applied";
  var statusError = "error";
  var statusNative = "native";

  var dataPrefix = "data-";
  var statusDataName = "ll-status";
  var timeoutDataName = "ll-timeout";
  var getData = function getData(element, attribute) {
    return element.getAttribute(dataPrefix + attribute);
  };
  var setData = function setData(element, attribute, value) {
    var attrName = dataPrefix + attribute;

    if (value === null) {
      element.removeAttribute(attrName);
      return;
    }

    element.setAttribute(attrName, value);
  };
  var getStatus = function getStatus(element) {
    return getData(element, statusDataName);
  };
  var setStatus = function setStatus(element, status) {
    return setData(element, statusDataName, status);
  };
  var resetStatus = function resetStatus(element) {
    return setStatus(element, null);
  };
  var hasEmptyStatus = function hasEmptyStatus(element) {
    return getStatus(element) === null;
  };
  var hasStatusLoading = function hasStatusLoading(element) {
    return getStatus(element) === statusLoading;
  };
  var hasStatusError = function hasStatusError(element) {
    return getStatus(element) === statusError;
  };
  var hasStatusDelayed = function hasStatusDelayed(element) {
    return getStatus(element) === statusDelayed;
  };
  var statusesAfterLoading = [statusLoading, statusApplied, statusLoaded, statusError];
  var hasStatusAfterLoading = function hasStatusAfterLoading(element) {
    return statusesAfterLoading.indexOf(getStatus(element)) > -1;
  };
  var setTimeoutData = function setTimeoutData(element, value) {
    return setData(element, timeoutDataName, value);
  };
  var getTimeoutData = function getTimeoutData(element) {
    return getData(element, timeoutDataName);
  };

  var safeCallback = function safeCallback(callback, arg1, arg2, arg3) {
    if (!callback) {
      return;
    }

    if (arg3 !== undefined) {
      callback(arg1, arg2, arg3);
      return;
    }

    if (arg2 !== undefined) {
      callback(arg1, arg2);
      return;
    }

    callback(arg1);
  };

  var addClass = function addClass(element, className) {
    if (supportsClassList) {
      element.classList.add(className);
      return;
    }

    element.className += (element.className ? " " : "") + className;
  };
  var removeClass = function removeClass(element, className) {
    if (supportsClassList) {
      element.classList.remove(className);
      return;
    }

    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
  };

  var addTempImage = function addTempImage(element) {
    element.llTempImage = document.createElement("img");
  };
  var deleteTempImage = function deleteTempImage(element) {
    delete element.llTempImage;
  };
  var getTempImage = function getTempImage(element) {
    return element.llTempImage;
  };

  var unobserve = function unobserve(element, settings, instance) {
    if (!instance) return;
    var observer = instance._observer;
    if (!observer || !settings.auto_unobserve) return;
    observer.unobserve(element);
  };
  var resetObserver = function resetObserver(observer) {
    observer.disconnect();
  };

  var _src_ = "src";
  var _srcset_ = "srcset";
  var _sizes_ = "sizes";
  var _poster_ = "poster";
  var _PICTURE_ = "PICTURE";
  var increaseLoadingCount = function increaseLoadingCount(instance) {
    if (!instance) return;
    instance.loadingCount += 1;
  };
  var getSourceTags = function getSourceTags(parentTag) {
    var sourceTags = [];

    for (var i = 0, childTag; childTag = parentTag.children[i]; i += 1) {
      if (childTag.tagName === "SOURCE") {
        sourceTags.push(childTag);
      }
    }

    return sourceTags;
  };
  var setAttributeIfValue = function setAttributeIfValue(element, attrName, value) {
    if (!value) {
      return;
    }

    element.setAttribute(attrName, value);
  };
  var resetAttribute = function resetAttribute(element, attrName) {
    element.removeAttribute(attrName);
  };
  var hasOriginalAttributes = function hasOriginalAttributes(element) {
    return !!element.llOriginalAttrs;
  };
  var saveOriginalImageAttributes = function saveOriginalImageAttributes(element) {
    if (hasOriginalAttributes(element)) return;
    var originalAttributes = {};
    originalAttributes[_src_] = element.getAttribute(_src_);
    originalAttributes[_srcset_] = element.getAttribute(_srcset_);
    originalAttributes[_sizes_] = element.getAttribute(_sizes_);
    element.llOriginalAttrs = originalAttributes;
  };
  var restoreOriginalImageAttributes = function restoreOriginalImageAttributes(element) {
    if (!hasOriginalAttributes(element)) return;
    var originalAttributes = element.llOriginalAttrs;
    setAttributeIfValue(element, _src_, originalAttributes[_src_]);
    setAttributeIfValue(element, _srcset_, originalAttributes[_srcset_]);
    setAttributeIfValue(element, _sizes_, originalAttributes[_sizes_]);
  };
  var setImageAttributes = function setImageAttributes(element, settings) {
    setAttributeIfValue(element, _sizes_, getData(element, settings.data_sizes));
    setAttributeIfValue(element, _srcset_, getData(element, settings.data_srcset));
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
  };
  var resetImageAttributes = function resetImageAttributes(element) {
    resetAttribute(element, _src_);
    resetAttribute(element, _srcset_);
    resetAttribute(element, _sizes_);
  };
  var forEachPictureSource = function forEachPictureSource(element, fn) {
    var parent = element.parentNode;
    if (!parent || parent.tagName !== _PICTURE_) return;
    var sourceTags = getSourceTags(parent);
    sourceTags.forEach(fn);
  };
  var restoreOriginalAttributesImg = function restoreOriginalAttributesImg(element) {
    forEachPictureSource(element, function (sourceTag) {
      restoreOriginalImageAttributes(sourceTag);
    });
    restoreOriginalImageAttributes(element);
  };
  var setSourcesImg = function setSourcesImg(element, settings) {
    forEachPictureSource(element, function (sourceTag) {
      saveOriginalImageAttributes(sourceTag);
      setImageAttributes(sourceTag, settings);
    });
    saveOriginalImageAttributes(element);
    setImageAttributes(element, settings);
  };
  var resetSourcesImg = function resetSourcesImg(element) {
    forEachPictureSource(element, function (sourceTag) {
      resetImageAttributes(sourceTag);
    });
    resetImageAttributes(element);
  };
  var setSourcesIframe = function setSourcesIframe(element, settings) {
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
  };
  var setSourcesVideo = function setSourcesVideo(element, settings) {
    var sourceTags = getSourceTags(element);
    sourceTags.forEach(function (sourceTag) {
      setAttributeIfValue(sourceTag, _src_, getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, _poster_, getData(element, settings.data_poster));
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
    element.load();
  };
  var setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
  };
  var setBackground = function setBackground(element, settings, instance) {
    var bg1xValue = getData(element, settings.data_bg);
    var bgHiDpiValue = getData(element, settings.data_bg_hidpi);
    var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) return;
    element.style.backgroundImage = "url(\"".concat(bgDataValue, "\")");
    getTempImage(element).setAttribute(_src_, bgDataValue); // Annotate and notify loading

    increaseLoadingCount(instance);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
    safeCallback(settings.callback_reveal, element, instance); // <== DEPRECATED
  }; // NOTE: THE TEMP IMAGE TRICK CANNOT BE DONE WITH data-multi-bg
  // BECAUSE INSIDE ITS VALUES MUST BE WRAPPED WITH URL() AND ONE OF THEM
  // COULD BE A GRADIENT BACKGROUND IMAGE

  var setMultiBackground = function setMultiBackground(element, settings, instance) {
    var bg1xValue = getData(element, settings.data_bg_multi);
    var bgHiDpiValue = getData(element, settings.data_bg_multi_hidpi);
    var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) return;
    element.style.backgroundImage = bgDataValue; // Annotate and notify applied

    addClass(element, settings.class_applied);
    setStatus(element, statusApplied);
    unobserve(element, settings, instance); // Unobserve here because we can't do it on load

    safeCallback(settings.callback_applied, element, instance);
  };
  var setSources = function setSources(element, settings, instance) {
    var setSourcesFunction = setSourcesFunctions[element.tagName];
    if (!setSourcesFunction) return;
    setSourcesFunction(element, settings); // Annotate and notify loading

    increaseLoadingCount(instance);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
    safeCallback(settings.callback_reveal, element, instance); // <== DEPRECATED
  };

  var genericLoadEventName = "load";
  var mediaLoadEventName = "loadeddata";
  var errorEventName = "error";
  var elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];
  var hasLoadEvent = function hasLoadEvent(element) {
    return elementsWithLoadEvent.indexOf(element.tagName) > -1;
  };
  var decreaseLoadingCount = function decreaseLoadingCount(instance) {
    if (!instance) return;
    instance.loadingCount -= 1;
  };
  var checkFinish = function checkFinish(settings, instance) {
    if (!instance || instance.toLoadCount || instance.loadingCount) return;
    safeCallback(settings.callback_finish, instance);
  };
  var addEventListener = function addEventListener(element, eventName, handler) {
    element.addEventListener(eventName, handler);
    element.llEvLisnrs[eventName] = handler;
  };
  var removeEventListener = function removeEventListener(element, eventName, handler) {
    element.removeEventListener(eventName, handler);
  };
  var hasEventListeners = function hasEventListeners(element) {
    return !!element.llEvLisnrs;
  };
  var addEventListeners = function addEventListeners(element, loadHandler, errorHandler) {
    if (!hasEventListeners(element)) element.llEvLisnrs = {};
    addEventListener(element, genericLoadEventName, loadHandler);
    addEventListener(element, errorEventName, errorHandler);
    if (element.tagName !== "VIDEO") return;
    addEventListener(element, mediaLoadEventName, loadHandler);
  };
  var removeEventListeners = function removeEventListeners(element) {
    if (!hasEventListeners(element)) return;
    var eventListeners = element.llEvLisnrs;

    for (var eventName in eventListeners) {
      var handler = eventListeners[eventName];
      removeEventListener(element, eventName, handler);
    }

    delete element.llEvLisnrs;
  };
  var doneHandler = function doneHandler(element, settings, instance) {
    deleteTempImage(element);
    decreaseLoadingCount(instance);
    removeClass(element, settings.class_loading);
    unobserve(element, settings, instance);
  };
  var loadHandler = function loadHandler(event, element, settings, instance) {
    doneHandler(element, settings, instance);
    addClass(element, settings.class_loaded);
    setStatus(element, statusLoaded);
    safeCallback(settings.callback_loaded, element, instance);
    checkFinish(settings, instance);
  };
  var errorHandler = function errorHandler(event, element, settings, instance) {
    doneHandler(element, settings, instance);
    addClass(element, settings.class_error);
    setStatus(element, statusError);
    safeCallback(settings.callback_error, element, instance);
    checkFinish(settings, instance);
  };
  var addOneShotEventListeners = function addOneShotEventListeners(element, settings, instance) {
    var elementToListenTo = getTempImage(element) || element;
    if (hasEventListeners(elementToListenTo)) return; // <- when retry loading, e.g. with cancel_on_exit

    var _loadHandler = function _loadHandler(event) {
      loadHandler(event, element, settings, instance);
      removeEventListeners(elementToListenTo);
    };

    var _errorHandler = function _errorHandler(event) {
      errorHandler(event, element, settings, instance);
      removeEventListeners(elementToListenTo);
    };

    addEventListeners(elementToListenTo, _loadHandler, _errorHandler);
  };

  var decreaseToLoadCount = function decreaseToLoadCount(instance) {
    if (!instance) return;
    instance.toLoadCount -= 1;
  };
  var increaseToLoadCount = function increaseToLoadCount(instance) {
    if (!instance) return;
    instance.toLoadCount += 1;
  };

  var loadBackground = function loadBackground(element, settings, instance) {
    addTempImage(element);
    addOneShotEventListeners(element, settings, instance);
    setBackground(element, settings, instance);
    setMultiBackground(element, settings, instance);
  };

  var loadRegular = function loadRegular(element, settings, instance) {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
  };

  var load = function load(element, settings, instance) {
    if (hasLoadEvent(element)) {
      loadRegular(element, settings, instance);
    } else {
      loadBackground(element, settings, instance);
    }

    decreaseToLoadCount(instance);
    checkFinish(settings, instance);
  };
  var loadNative = function loadNative(element, settings, instance) {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
    decreaseToLoadCount(instance);
    setStatus(element, statusNative);
    checkFinish(settings, instance);
  };

  var cancelDelayLoad = function cancelDelayLoad(element) {
    var timeoutId = getTimeoutData(element);

    if (!timeoutId) {
      return; // do nothing if timeout doesn't exist
    }

    if (hasStatusDelayed(element)) {
      // iffing because status could also be "loading"
      resetStatus(element);
    }

    clearTimeout(timeoutId);
    setTimeoutData(element, null);
  };
  var delayLoad = function delayLoad(element, settings, instance) {
    var loadDelay = settings.load_delay;
    var timeoutId = getTimeoutData(element);

    if (timeoutId) {
      return; // do nothing if timeout already set
    }

    timeoutId = setTimeout(function () {
      load(element, settings, instance);
      cancelDelayLoad(element);
    }, loadDelay);
    setStatus(element, statusDelayed);
    setTimeoutData(element, timeoutId);
  };

  var cancelIfLoading = function cancelIfLoading(element, entry, settings, instance) {
    if (element.tagName !== "IMG") return;
    removeEventListeners(element);
    resetSourcesImg(element);
    restoreOriginalAttributesImg(element);
    removeClass(element, settings.class_loading);
    decreaseLoadingCount(instance);
    safeCallback(settings.callback_cancel, element, entry, instance); // setTimeout is needed because the "callback_cancel" implementation
    // could be out of the main thread, e.g. `img.setAttribute("src", "")`

    setTimeout(function () {
      instance.resetElementStatus(element, instance);
    }, 0);
  };

  var onIntersecting = function onIntersecting(element, entry, settings, instance) {
    safeCallback(settings.callback_enter, element, entry, instance);
    if (hasStatusAfterLoading(element)) return; //Prevent loading it again, e.g. on !auto_unobserve

    if (settings.load_delay) {
      delayLoad(element, settings, instance);
      return;
    }

    load(element, settings, instance);
  };
  var onNotIntersecting = function onNotIntersecting(element, entry, settings, instance) {
    if (hasEmptyStatus(element)) return; //Ignore the first pass at landing

    if (settings.cancel_on_exit && hasStatusLoading(element)) {
      cancelIfLoading(element, entry, settings, instance);
    }

    safeCallback(settings.callback_exit, element, entry, instance);

    if (settings.load_delay && hasStatusDelayed(element)) {
      cancelDelayLoad(element);
    }
  };

  var nativeLazyTags = ["IMG", "IFRAME"];
  var loadingString = "loading";
  var shouldUseNative = function shouldUseNative(settings) {
    return settings.use_native && loadingString in HTMLImageElement.prototype;
  };
  var loadAllNative = function loadAllNative(elements, settings, instance) {
    elements.forEach(function (element) {
      if (nativeLazyTags.indexOf(element.tagName) === -1) {
        return;
      }

      element.setAttribute(loadingString, "lazy"); //TODO: Move inside the loadNative method

      loadNative(element, settings, instance);
    });
    instance.toLoadCount = 0;
  };

  var isIntersecting = function isIntersecting(entry) {
    return entry.isIntersecting || entry.intersectionRatio > 0;
  };

  var getObserverSettings = function getObserverSettings(settings) {
    return {
      root: settings.container === document ? null : settings.container,
      rootMargin: settings.thresholds || settings.threshold + "px"
    };
  };

  var intersectionHandler = function intersectionHandler(entries, settings, instance) {
    entries.forEach(function (entry) {
      return isIntersecting(entry) ? onIntersecting(entry.target, entry, settings, instance) : onNotIntersecting(entry.target, entry, settings, instance);
    });
  };

  var observeElements = function observeElements(observer, elements) {
    elements.forEach(function (element) {
      observer.observe(element);
    });
  };
  var updateObserver = function updateObserver(observer, elementsToObserve) {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
  };
  var setObserver = function setObserver(instance) {
    var settings = instance._settings;

    if (!supportsIntersectionObserver || shouldUseNative(instance._settings)) {
      return;
    }

    instance._observer = new IntersectionObserver(function (entries) {
      intersectionHandler(entries, settings, instance);
    }, getObserverSettings(settings));
  };

  var toArray = function toArray(nodeSet) {
    return Array.prototype.slice.call(nodeSet);
  };
  var queryElements = function queryElements(settings) {
    return settings.container.querySelectorAll(settings.elements_selector);
  };
  var excludeManagedElements = function excludeManagedElements(elements) {
    return toArray(elements).filter(hasEmptyStatus);
  };
  var hasError = function hasError(element) {
    return hasStatusError(element);
  };
  var filterErrorElements = function filterErrorElements(elements) {
    return toArray(elements).filter(hasError);
  };
  var getElementsToLoad = function getElementsToLoad(elements, settings) {
    return excludeManagedElements(elements || queryElements(settings));
  };

  var retryLazyLoad = function retryLazyLoad(instance) {
    var settings = instance._settings;
    var errorElements = filterErrorElements(queryElements(settings));
    errorElements.forEach(function (element) {
      removeClass(element, settings.class_error);
      resetStatus(element);
    });
    instance.update();
  };
  var setOnlineCheck = function setOnlineCheck(instance) {
    if (!runningOnBrowser) {
      return;
    }

    window.addEventListener("online", function (event) {
      retryLazyLoad(instance);
    });
  };

  var resetElementStatus = function resetElementStatus(element, instance) {
    if (hasStatusAfterLoading(element)) {
      increaseToLoadCount(instance);
    }

    setStatus(element, null);
  };

  var LazyLoad = function LazyLoad(customSettings, elements) {
    this._settings = getExtendedSettings(customSettings);
    this.loadingCount = 0;
    setObserver(this);
    setOnlineCheck(this);
    this.update(elements);
  };

  LazyLoad.prototype = {
    update: function update(givenNodeset) {
      var settings = this._settings;
      var elementsToLoad = getElementsToLoad(givenNodeset, settings);
      this.toLoadCount = elementsToLoad.length;

      if (isBot || !supportsIntersectionObserver) {
        this.loadAll(elementsToLoad);
        return;
      }

      if (shouldUseNative(settings)) {
        loadAllNative(elementsToLoad, settings, this);
        return;
      }

      updateObserver(this._observer, elementsToLoad);
    },
    destroy: function destroy() {
      // Observer
      if (this._observer) {
        this._observer.disconnect();
      }

      delete this._observer;
      delete this._settings;
      delete this.loadingCount;
      delete this.toLoadCount;
    },
    loadAll: function loadAll(elements) {
      var _this = this;

      var settings = this._settings;
      var elementsToLoad = getElementsToLoad(elements, settings);
      elementsToLoad.forEach(function (element) {
        load(element, settings, _this);
      });
    },
    resetElementStatus: function resetElementStatus$1(element) {
      resetElementStatus(element, this);
    },
    // DEPRECATED
    load: function load$1(element) {
      load(element, this._settings, this);
    }
  };

  LazyLoad.load = function (element, customSettings) {
    var settings = getExtendedSettings(customSettings);

    load(element, settings);
  }; // Automatic instances creation if required (useful for async script loading)


  if (runningOnBrowser) {
    autoInitialize(LazyLoad, window.lazyLoadOptions);
  }

  return LazyLoad;

})));
