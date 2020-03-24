var LazyLoad = (function () {
  'use strict';

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

  var defaultSettings = {
    elements_selector: "img",
    container: isBot || runningOnBrowser ? document : null,
    threshold: 300,
    thresholds: null,
    data_src: "src",
    data_srcset: "srcset",
    data_sizes: "sizes",
    data_bg: "bg",
    data_poster: "poster",
    class_loading: "loading",
    class_loaded: "loaded",
    class_error: "error",
    load_delay: 0,
    auto_unobserve: true,
    callback_enter: null,
    callback_exit: null,
    callback_loading: null,
    callback_loaded: null,
    callback_error: null,
    callback_finish: null,
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

  var statusObserved = "observed";
  var statusLoading = "loading";
  var statusLoaded = "loaded";
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
  var resetStatus = function resetStatus(element) {
    return setData(element, statusDataName, null);
  };
  var setStatus = function setStatus(element, status) {
    return setData(element, statusDataName, status);
  };
  var hasAnyStatus = function hasAnyStatus(element) {
    return getData(element, statusDataName) !== null;
  };
  var hasStatusObserved = function hasStatusObserved(element) {
    return getData(element, statusDataName) === statusObserved;
  };
  var hasStatusError = function hasStatusError(element) {
    return getData(element, statusDataName) === statusError;
  };
  var setTimeoutData = function setTimeoutData(element, value) {
    return setData(element, timeoutDataName, value);
  };
  var getTimeoutData = function getTimeoutData(element) {
    return getData(element, timeoutDataName);
  };

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
  var setImageAttributes = function setImageAttributes(element, settings) {
    setAttributeIfValue(element, "sizes", getData(element, settings.data_sizes));
    setAttributeIfValue(element, "srcset", getData(element, settings.data_srcset));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
  };
  var setSourcesImg = function setSourcesImg(element, settings) {
    var parent = element.parentNode;

    if (parent && parent.tagName === "PICTURE") {
      var sourceTags = getSourceTags(parent);
      sourceTags.forEach(function (sourceTag) {
        setImageAttributes(sourceTag, settings);
      });
    }

    setImageAttributes(element, settings);
  };
  var setSourcesIframe = function setSourcesIframe(element, settings) {
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
  };
  var setSourcesVideo = function setSourcesVideo(element, settings) {
    var sourceTags = getSourceTags(element);
    sourceTags.forEach(function (sourceTag) {
      setAttributeIfValue(sourceTag, "src", getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, "poster", getData(element, settings.data_poster));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
    element.load();
  };
  var setSourcesBgImage = function setSourcesBgImage(element, settings) {
    var srcDataValue = getData(element, settings.data_src);
    var bgDataValue = getData(element, settings.data_bg);

    if (srcDataValue) {
      element.style.backgroundImage = "url(\"".concat(srcDataValue, "\")");
    }

    if (bgDataValue) {
      element.style.backgroundImage = bgDataValue;
    }
  };
  var setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
  };
  var setSources = function setSources(element, settings, instance) {
    var tagName = element.tagName;
    var setSourcesFunction = setSourcesFunctions[tagName];

    if (setSourcesFunction) {
      setSourcesFunction(element, settings);
      increaseLoadingCount(instance);
    } else {
      setSourcesBgImage(element, settings);
    }
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

  var genericLoadEventName = "load";
  var mediaLoadEventName = "loadeddata";
  var errorEventName = "error";
  var decreaseLoadingCount = function decreaseLoadingCount(settings, instance) {
    if (!instance) return;
    instance.loadingCount -= 1;
    checkFinish(settings, instance);
  };
  var checkFinish = function checkFinish(settings, instance) {
    if (instance.toLoadCount || instance.loadingCount) return;
    safeCallback(settings.callback_finish, instance);
  };
  var addEventListener = function addEventListener(element, eventName, handler) {
    element.addEventListener(eventName, handler);
  };
  var removeEventListener = function removeEventListener(element, eventName, handler) {
    element.removeEventListener(eventName, handler);
  };
  var addEventListeners = function addEventListeners(element, loadHandler, errorHandler) {
    addEventListener(element, genericLoadEventName, loadHandler);
    addEventListener(element, mediaLoadEventName, loadHandler);
    addEventListener(element, errorEventName, errorHandler);
  };
  var removeEventListeners = function removeEventListeners(element, loadHandler, errorHandler) {
    removeEventListener(element, genericLoadEventName, loadHandler);
    removeEventListener(element, mediaLoadEventName, loadHandler);
    removeEventListener(element, errorEventName, errorHandler);
  };
  var loadHandler = function loadHandler(event, settings, instance) {
    var element = event.target;
    setStatus(element, statusLoaded);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_loaded);
    safeCallback(settings.callback_loaded, element, instance);
    decreaseLoadingCount(settings, instance);
  };
  var errorHandler = function errorHandler(event, settings, instance) {
    var element = event.target;
    setStatus(element, statusError);
    removeClass(element, settings.class_loading);
    addClass(element, settings.class_error);
    safeCallback(settings.callback_error, element, instance);
    decreaseLoadingCount(settings, instance);
  };
  var addOneShotEventListeners = function addOneShotEventListeners(element, settings, instance) {
    var _loadHandler = function _loadHandler(event) {
      loadHandler(event, settings, instance);
      removeEventListeners(element, _loadHandler, _errorHandler);
    };

    var _errorHandler = function _errorHandler(event) {
      errorHandler(event, settings, instance);
      removeEventListeners(element, _loadHandler, _errorHandler);
    };

    addEventListeners(element, _loadHandler, _errorHandler);
  };

  var manageableTags = ["IMG", "IFRAME", "VIDEO"];
  var decreaseToLoadCount = function decreaseToLoadCount(settings, instance) {
    if (!instance) return;
    instance.toLoadCount -= 1;
    checkFinish(settings, instance);
  };
  var unobserve = function unobserve(element, instance) {
    if (!instance) return;
    var observer = instance._observer;

    if (observer && instance._settings.auto_unobserve) {
      observer.unobserve(element);
    }
  };
  var isManageableTag = function isManageableTag(element) {
    return manageableTags.indexOf(element.tagName) > -1;
  };
  var enableLoading = function enableLoading(element, settings, instance) {
    if (isManageableTag(element)) {
      addOneShotEventListeners(element, settings, instance);
      addClass(element, settings.class_loading);
    }

    setSources(element, settings, instance);
    decreaseToLoadCount(settings, instance);
  };
  var load = function load(element, settings, instance) {
    enableLoading(element, settings, instance);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
    /* DEPRECATED, REMOVE IN V.15 => */

    safeCallback(settings.callback_reveal, element, instance);
    unobserve(element, instance);
  };
  var loadNative = function loadNative(element, settings, instance) {
    enableLoading(element, settings, instance);
    setStatus(element, statusNative);
  };

  var cancelDelayLoad = function cancelDelayLoad(element) {
    var timeoutId = getTimeoutData(element);

    if (!timeoutId) {
      return; // do nothing if timeout doesn't exist
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
    setTimeoutData(element, timeoutId);
  };

  var onEnter = function onEnter(element, entry, instance) {
    var settings = instance._settings;
    safeCallback(settings.callback_enter, element, entry, instance);

    if (!settings.load_delay) {
      load(element, settings, instance);
      return;
    }

    delayLoad(element, settings, instance);
  };
  var onExit = function onExit(element, entry, instance) {
    var settings = instance._settings;
    safeCallback(settings.callback_exit, element, entry, instance);

    if (!settings.load_delay) {
      return;
    }

    cancelDelayLoad(element);
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

      element.setAttribute(loadingString, "lazy");
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

  var resetObserver = function resetObserver(observer) {
    observer.disconnect();
  };
  var observeElements = function observeElements(observer, elements) {
    elements.forEach(function (element) {
      observer.observe(element);
      setStatus(element, statusObserved);
    });
  };
  var updateObserver = function updateObserver(observer, elementsToObserve) {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
  };
  var setObserver = function setObserver(instance) {
    if (!supportsIntersectionObserver || shouldUseNative(instance._settings)) {
      return;
    }

    instance._observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        return isIntersecting(entry) ? onEnter(entry.target, entry, instance) : onExit(entry.target, entry, instance);
      });
    }, getObserverSettings(instance._settings));
  };

  var toArray = function toArray(nodeSet) {
    return Array.prototype.slice.call(nodeSet);
  };
  var queryElements = function queryElements(settings) {
    return settings.container.querySelectorAll(settings.elements_selector);
  };
  var isToManage = function isToManage(element) {
    return !hasAnyStatus(element) || hasStatusObserved(element);
  };
  var excludeManagedElements = function excludeManagedElements(elements) {
    return toArray(elements).filter(isToManage);
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
    load: function load$1(element) {
      /* DEPRECATED, REMOVE IN V.15 */
      load(element, this._settings, this);
    }
  };

  LazyLoad.load = function (element, customSettings) {
    var settings = getExtendedSettings(customSettings);

    load(element, settings);
  };
  /* Automatic instances creation if required (useful for async script loading) */


  if (runningOnBrowser) {
    autoInitialize(LazyLoad, window.lazyLoadOptions);
  }

  return LazyLoad;

}());
