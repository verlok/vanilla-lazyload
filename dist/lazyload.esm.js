const runningOnBrowser = typeof window !== "undefined";

const isBot =
    (runningOnBrowser && !("onscroll" in window)) ||
    (typeof navigator !== "undefined" && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent));

const supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

const supportsClassList = runningOnBrowser && "classList" in document.createElement("p");

const isHiDpi = runningOnBrowser && window.devicePixelRatio > 1;

const defaultSettings = {
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
    unobserve_completed: true,
    unobserve_entered: false,
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

const getExtendedSettings = customSettings => {
    return Object.assign({}, defaultSettings, customSettings);
};

/* Creates instance and notifies it through the window element */
const createInstance = function(classObj, options) {
    var event;
    let eventString = "LazyLoad::Initialized";
    let instance = new classObj(options);
    try {
        // Works in modern browsers
        event = new CustomEvent(eventString, { detail: { instance } });
    } catch (err) {
        // Works in Internet Explorer (all versions)
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventString, false, false, { instance });
    }
    window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
const autoInitialize = (classObj, options) => {
    if (!options) {
        return;
    }
    if (!options.length) {
        // Plain object
        createInstance(classObj, options);
    } else {
        // Array of objects
        for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
            createInstance(classObj, optionsItem);
        }
    }
};

const statusLoading = "loading";
const statusLoaded = "loaded";
const statusApplied = "applied";
const statusError = "error";
const statusNative = "native";

const dataPrefix = "data-";
const statusDataName = "ll-status";

const getData = (element, attribute) => {
    return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
    var attrName = dataPrefix + attribute;
    if (value === null) {
        element.removeAttribute(attrName);
        return;
    }
    element.setAttribute(attrName, value);
};

const getStatus = (element) => getData(element, statusDataName);
const setStatus = (element, status) => setData(element, statusDataName, status);
const resetStatus = (element) => setStatus(element, null);

const hasEmptyStatus = (element) => getStatus(element) === null;
const hasStatusLoading = (element) => getStatus(element) === statusLoading;
const hasStatusError = (element) => getStatus(element) === statusError;

const statusesAfterLoading = [statusLoading, statusApplied, statusLoaded, statusError];
const hasStatusAfterLoading = (element) =>
    statusesAfterLoading.indexOf(getStatus(element)) > -1;

const safeCallback = (callback, arg1, arg2, arg3) => {
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

const addClass = (element, className) => {
	if (supportsClassList) {
		element.classList.add(className);
		return;
	}
	element.className += (element.className ? " " : "") + className;
};

const removeClass = (element, className) => {
	if (supportsClassList) {
		element.classList.remove(className);
		return;
	}
	element.className = element.className.
		replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").
		replace(/^\s+/, "").
		replace(/\s+$/, "");
};

const addTempImage = element => {
    element.llTempImage = document.createElement("img");
};

const deleteTempImage = element => {
    delete element.llTempImage;
};

const getTempImage = element => element.llTempImage;

const unobserve = (element, instance) => {
    if (!instance) return;
    const observer = instance._observer;
    if (!observer) return;
    observer.unobserve(element);
};

const resetObserver = (observer) => {
    observer.disconnect();
};

const updateLoadingCount = (instance, delta) => {
    if (!instance) return;
    instance.loadingCount += delta;
};

const decreaseToLoadCount = (instance) => {
    if (!instance) return;
    instance.toLoadCount -= 1;
};

const setToLoadCount = (instance, value) => {
    if (!instance) return;
    instance.toLoadCount = value;
};

const isSomethingLoading = (instance) => instance.loadingCount > 0;

const haveElementsToLoad = (instance) => instance.toLoadCount > 0;

const _src_ = "src";
const _srcset_ = "srcset";
const _sizes_ = "sizes";
const _poster_ = "poster";
const _PICTURE_ = "PICTURE";

const getSourceTags = (parentTag) => {
    let sourceTags = [];
    for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
        if (childTag.tagName === "SOURCE") {
            sourceTags.push(childTag);
        }
    }
    return sourceTags;
};

const setAttributeIfValue = (element, attrName, value) => {
    if (!value) {
        return;
    }
    element.setAttribute(attrName, value);
};

const resetAttribute = (element, attrName) => {
    element.removeAttribute(attrName);
};

const hasOriginalAttributes = (element) => {
    return !!element.llOriginalAttrs;
};

const saveOriginalImageAttributes = (element) => {
    if (hasOriginalAttributes(element)) {
        return;
    }
    const originalAttributes = {};
    originalAttributes[_src_] = element.getAttribute(_src_);
    originalAttributes[_srcset_] = element.getAttribute(_srcset_);
    originalAttributes[_sizes_] = element.getAttribute(_sizes_);
    element.llOriginalAttrs = originalAttributes;
};

const restoreOriginalImageAttributes = (element) => {
    if (!hasOriginalAttributes(element)) {
        return;
    }
    const originalAttributes = element.llOriginalAttrs;
    setAttributeIfValue(element, _src_, originalAttributes[_src_]);
    setAttributeIfValue(element, _srcset_, originalAttributes[_srcset_]);
    setAttributeIfValue(element, _sizes_, originalAttributes[_sizes_]);
};

const setImageAttributes = (element, settings) => {
    setAttributeIfValue(element, _sizes_, getData(element, settings.data_sizes));
    setAttributeIfValue(element, _srcset_, getData(element, settings.data_srcset));
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
};

const resetImageAttributes = (element) => {
    resetAttribute(element, _src_);
    resetAttribute(element, _srcset_);
    resetAttribute(element, _sizes_);
};

const forEachPictureSource = (element, fn) => {
    const parent = element.parentNode;
    if (!parent || parent.tagName !== _PICTURE_) {
        return;
    }
    let sourceTags = getSourceTags(parent);
    sourceTags.forEach(fn);
};

const restoreOriginalAttributesImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        restoreOriginalImageAttributes(sourceTag);
    });
    restoreOriginalImageAttributes(element);
};

const setSourcesImg = (element, settings) => {
    forEachPictureSource(element, (sourceTag) => {
        saveOriginalImageAttributes(sourceTag);
        setImageAttributes(sourceTag, settings);
    });
    saveOriginalImageAttributes(element);
    setImageAttributes(element, settings);
};

const resetSourcesImg = (element) => {
    forEachPictureSource(element, (sourceTag) => {
        resetImageAttributes(sourceTag);
    });
    resetImageAttributes(element);
};

const setSourcesIframe = (element, settings) => {
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
};

const setSourcesVideo = (element, settings) => {
    let sourceTags = getSourceTags(element);
    sourceTags.forEach((sourceTag) => {
        setAttributeIfValue(sourceTag, _src_, getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, _poster_, getData(element, settings.data_poster));
    setAttributeIfValue(element, _src_, getData(element, settings.data_src));
    element.load();
};

const setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
};

const setBackground = (element, settings, instance) => {
    const bg1xValue = getData(element, settings.data_bg);
    const bgHiDpiValue = getData(element, settings.data_bg_hidpi);
    const bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) return;
    element.style.backgroundImage = `url("${bgDataValue}")`;
    getTempImage(element).setAttribute(_src_, bgDataValue);
    // Annotate and notify loading
    updateLoadingCount(instance, +1);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
};

// NOTE: THE TEMP IMAGE TRICK CANNOT BE DONE WITH data-multi-bg
// BECAUSE INSIDE ITS VALUES MUST BE WRAPPED WITH URL() AND ONE OF THEM
// COULD BE A GRADIENT BACKGROUND IMAGE
const setMultiBackground = (element, settings, instance) => {
    const bg1xValue = getData(element, settings.data_bg_multi);
    const bgHiDpiValue = getData(element, settings.data_bg_multi_hidpi);
    const bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) {
        return;
    }
    element.style.backgroundImage = bgDataValue;
    // Annotate and notify applied
    addClass(element, settings.class_applied);
    setStatus(element, statusApplied);
    safeCallback(settings.callback_applied, element, instance);
    if (settings.unobserve_completed) {
        // Unobserve now because we can't do it on load
        unobserve(element, settings);
    }
};

const setSources = (element, settings, instance) => {
    const setSourcesFunction = setSourcesFunctions[element.tagName];
    if (!setSourcesFunction) {
        return;
    }
    setSourcesFunction(element, settings);
    // Annotate and notify loading
    updateLoadingCount(instance, +1);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
};

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];
const hasLoadEvent = (element) => elementsWithLoadEvent.indexOf(element.tagName) > -1;

const checkFinish = (settings, instance) => {
    if (instance && !isSomethingLoading(instance) && !haveElementsToLoad(instance)) {
        safeCallback(settings.callback_finish, instance);
    }
};

const addEventListener = (element, eventName, handler) => {
    element.addEventListener(eventName, handler);
    element.llEvLisnrs[eventName] = handler;
};

const removeEventListener = (element, eventName, handler) => {
    element.removeEventListener(eventName, handler);
};

const hasEventListeners = (element) => {
    return !!element.llEvLisnrs;
};

const addEventListeners = (element, loadHandler, errorHandler) => {
    if (!hasEventListeners(element)) element.llEvLisnrs = {};
    addEventListener(element, genericLoadEventName, loadHandler);
    addEventListener(element, errorEventName, errorHandler);
    if (element.tagName === "VIDEO") {
        addEventListener(element, mediaLoadEventName, loadHandler);
    }
};

const removeEventListeners = (element) => {
    if (!hasEventListeners(element)) {
        return;
    }
    const eventListeners = element.llEvLisnrs;
    for (let eventName in eventListeners) {
        const handler = eventListeners[eventName];
        removeEventListener(element, eventName, handler);
    }
    delete element.llEvLisnrs;
};

const doneHandler = (element, settings, instance) => {
    deleteTempImage(element);
    updateLoadingCount(instance, -1);
    decreaseToLoadCount(instance);
    removeClass(element, settings.class_loading);
    if (settings.unobserve_completed) {
        unobserve(element, instance);
    }
};

const loadHandler = (event, element, settings, instance) => {
    doneHandler(element, settings, instance);
    addClass(element, settings.class_loaded);
    setStatus(element, statusLoaded);
    safeCallback(settings.callback_loaded, element, instance);
    checkFinish(settings, instance);
};

const errorHandler = (event, element, settings, instance) => {
    doneHandler(element, settings, instance);
    addClass(element, settings.class_error);
    setStatus(element, statusError);
    safeCallback(settings.callback_error, element, instance);
    checkFinish(settings, instance);
};

const addOneShotEventListeners = (element, settings, instance) => {
    const elementToListenTo = getTempImage(element) || element;
    if (hasEventListeners(elementToListenTo)) {
        // This happens when loading is retried twice
        return;
    }
    const _loadHandler = (event) => {
        loadHandler(event, element, settings, instance);
        removeEventListeners(elementToListenTo);
    };
    const _errorHandler = (event) => {
        errorHandler(event, element, settings, instance);
        removeEventListeners(elementToListenTo);
    };
    addEventListeners(elementToListenTo, _loadHandler, _errorHandler);
};

const loadBackground = (element, settings, instance) => {
    addTempImage(element);
    addOneShotEventListeners(element, settings, instance);
    setBackground(element, settings, instance);
    setMultiBackground(element, settings, instance);
};

const loadRegular = (element, settings, instance) => {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
};

const load = (element, settings, instance) => {
    if (hasLoadEvent(element)) {
        loadRegular(element, settings, instance);
    } else {
        loadBackground(element, settings, instance);
    }
    checkFinish(settings, instance);
};

const loadNative = (element, settings, instance) => {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings, instance);
    setStatus(element, statusNative);
    checkFinish(settings, instance);
};

const cancelIfLoading = (element, entry, settings, instance) => {
	if (element.tagName !== "IMG") {
		// Can't cancel loading on anything but images
		return;
	}
	removeEventListeners(element);
	resetSourcesImg(element);
	restoreOriginalAttributesImg(element);
	removeClass(element, settings.class_loading);
	updateLoadingCount(instance, -1);
	safeCallback(settings.callback_cancel, element, entry, instance);
	// setTimeout is needed because the "callback_cancel" implementation
	// could be out of the main thread, e.g. `img.setAttribute("src", "")`
	setTimeout(() => {
		resetStatus(element);
	}, 0);
};

const onEnter = (element, entry, settings, instance) => {
    safeCallback(settings.callback_enter, element, entry, instance);
    if (hasStatusAfterLoading(element)) {
        return; //Prevent loading it again
    }
    if (settings.unobserve_entered) {
        unobserve(element, instance);
    }
    load(element, settings, instance);
};

const onExit = (element, entry, settings, instance) => {
    if (hasEmptyStatus(element)) {
        return; //Ignore the first pass, at landing
    }
    if (settings.cancel_on_exit && hasStatusLoading(element)) {
        cancelIfLoading(element, entry, settings, instance);
    }
    safeCallback(settings.callback_exit, element, entry, instance);
};

const nativeLazyTags = ["IMG", "IFRAME"];
const loadingString = "loading";

const shouldUseNative = settings =>
    settings.use_native && loadingString in HTMLImageElement.prototype;

const loadAllNative = (elements, settings, instance) => {
    elements.forEach(element => {
        if (nativeLazyTags.indexOf(element.tagName) === -1) {
            return;
        }
        element.setAttribute(loadingString, "lazy"); //TODO: Move inside the loadNative method
        loadNative(element, settings, instance);
    });
    setToLoadCount(instance, 0);
};

const isIntersecting = (entry) => entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = (settings) => ({
    root: settings.container === document ? null : settings.container,
    rootMargin: settings.thresholds || settings.threshold + "px"
});

const intersectionHandler = (entries, settings, instance) => {
    entries.forEach((entry) =>
        isIntersecting(entry)
            ? onEnter(entry.target, entry, settings, instance)
            : onExit(entry.target, entry, settings, instance)
    );
};

const observeElements = (observer, elements) => {
    elements.forEach((element) => {
        observer.observe(element);
    });
};

const updateObserver = (observer, elementsToObserve) => {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
};

const setObserver = (settings, instance) => {
    if (!supportsIntersectionObserver || shouldUseNative(settings)) {
        return;
    }
    instance._observer = new IntersectionObserver((entries) => {
        intersectionHandler(entries, settings, instance);
    }, getObserverSettings(settings));
};

const toArray = (nodeSet) => Array.prototype.slice.call(nodeSet);

const queryElements = (settings) =>
    settings.container.querySelectorAll(settings.elements_selector);

const excludeManagedElements = (elements) => toArray(elements).filter(hasEmptyStatus);

const hasError = (element) => hasStatusError(element);
const filterErrorElements = (elements) => toArray(elements).filter(hasError);

const getElementsToLoad = (elements, settings) =>
    excludeManagedElements(elements || queryElements(settings));

const retryLazyLoad = (settings, instance) => {
    const errorElements = filterErrorElements(queryElements(settings));
    errorElements.forEach(element => {
        removeClass(element, settings.class_error);
        resetStatus(element);
    });
    instance.update();
};

const setOnlineCheck = (settings, instance) => {
    if (!runningOnBrowser) {
        return;
    }
    window.addEventListener("online", () => {
        retryLazyLoad(settings, instance);
    });
};

const LazyLoad = function (customSettings, elements) {
    const settings = getExtendedSettings(customSettings);
    this._settings = settings;
    this.loadingCount = 0;
    setObserver(settings, this);
    setOnlineCheck(settings, this);
    this.update(elements);
};

LazyLoad.prototype = {
    update: function (givenNodeset) {
        const settings = this._settings;
        const elementsToLoad = getElementsToLoad(givenNodeset, settings);
        setToLoadCount(this, elementsToLoad.length);

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

    destroy: function () {
        // Observer
        if (this._observer) {
            this._observer.disconnect();
        }
        delete this._observer;
        delete this._settings;
        delete this.loadingCount;
        delete this.toLoadCount;
    },

    loadAll: function (elements) {
        const settings = this._settings;
        const elementsToLoad = getElementsToLoad(elements, settings);
        elementsToLoad.forEach((element) => {
            load(element, settings, this);
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
