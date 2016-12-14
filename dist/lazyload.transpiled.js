"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _defaultSettings = {
    elements_selector: "img",
    container: window,
    threshold: 300,
    throttle: 50,
    data_src: "original",
    data_srcset: "original-set",
    class_loading: "loading",
    class_loaded: "loaded",
    skip_invisible: true,
    callback_load: null,
    callback_error: null,
    callback_set: null,
    callback_processed: null
},
    _supportsAddEventListener = !!window.addEventListener,
    _supportsAttachEvent = !!window.attachEvent,
    _supportsClassList = !!document.body.classList;

/*
 * PRIVATE FUNCTIONS *NOT RELATED* TO A SPECIFIC INSTANCE OF LAZY LOAD
 * -------------------------------------------------------------------
 */

function _addEventListener(element, eventName, callback) {
    // Use addEventListener if available
    if (_supportsAddEventListener) {
        element.addEventListener(eventName, callback);
        return;
    }
    // Otherwise use attachEvent, set this and event
    if (_supportsAttachEvent) {
        element.attachEvent('on' + eventName, function (el) {
            return function () {
                callback.call(el, window.event);
            };
        }(element));
        // Break closure and primary circular reference to element
        element = null;
    }
}

function _removeEventListener(element, eventName, callback) {
    // Use removeEventListener if available
    if (_supportsAddEventListener) {
        element.removeEventListener(eventName, callback);
        return;
    }
    // Otherwise use detachEvent
    if (_supportsAttachEvent) {
        element.detachEvent('on' + eventName, callback);
    }
}

function _isInsideViewport(element, container, threshold) {
    var ownerDocument, documentTop, documentLeft;

    function _getDocumentWidth() {
        return window.innerWidth || ownerDocument.documentElement.clientWidth || document.body.clientWidth;
    }

    function _getDocumentHeight() {
        return window.innerHeight || ownerDocument.documentElement.clientHeight || document.body.clientHeight;
    }

    function _getTopOffset(element) {
        return element.getBoundingClientRect().top + documentTop - ownerDocument.documentElement.clientTop;
    }

    function _getLeftOffset(element) {
        return element.getBoundingClientRect().left + documentLeft - ownerDocument.documentElement.clientLeft;
    }

    function _isBelowViewport() {
        var fold;
        if (container === window) {
            fold = _getDocumentHeight() + documentTop;
        } else {
            fold = _getTopOffset(container) + container.offsetHeight;
        }
        return fold <= _getTopOffset(element) - threshold;
    }

    function _isAtRightOfViewport() {
        var fold;
        if (container === window) {
            fold = _getDocumentWidth() + window.pageXOffset;
        } else {
            fold = _getLeftOffset(container) + _getDocumentWidth();
        }
        return fold <= _getLeftOffset(element) - threshold;
    }

    function _isAboveViewport() {
        var fold;
        if (container === window) {
            fold = documentTop;
        } else {
            fold = _getTopOffset(container);
        }
        return fold >= _getTopOffset(element) + threshold + element.offsetHeight;
    }

    function _isAtLeftOfViewport() {
        var fold;
        if (container === window) {
            fold = documentLeft;
        } else {
            fold = _getLeftOffset(container);
        }
        return fold >= _getLeftOffset(element) + threshold + element.offsetWidth;
    }

    ownerDocument = element.ownerDocument;
    documentTop = window.pageYOffset || ownerDocument.body.scrollTop;
    documentLeft = window.pageXOffset || ownerDocument.body.scrollLeft;

    return !_isBelowViewport() && !_isAboveViewport() && !_isAtRightOfViewport() && !_isAtLeftOfViewport();
}

function _now() {
    return new Date().getTime();
}

function _merge_objects(obj1, obj2) {
    var obj3 = {},
        propertyName;
    for (propertyName in obj1) {
        if (obj1.hasOwnProperty(propertyName)) {
            obj3[propertyName] = obj1[propertyName];
        }
    }
    for (propertyName in obj2) {
        if (obj2.hasOwnProperty(propertyName)) {
            obj3[propertyName] = obj2[propertyName];
        }
    }
    return obj3;
}

function _convertToArray(nodeSet) {
    try {
        return Array.prototype.slice.call(nodeSet);
    } catch (e) {
        var array = [],
            i,
            l = nodeSet.length;

        for (i = 0; i < l; i++) {
            array.push(nodeSet[i]);
        }
        return array;
    }
}

function _addClass(element, className) {
    /* HTML 5 compliant browsers. */
    if (_supportsClassList) {
        element.classList.add(className);
        return;
    }
    /* Legacy browsers (IE<10) support. */
    element.className += (element.className ? ' ' : '') + className;
}

function _removeClass(element, className) {
    /* HTML 5 compliant browsers. */
    if (_supportsClassList) {
        element.classList.remove(className);
        return;
    }
    /* Legacy browsers (IE<10) support. */
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').replace(/^\s+/, '').replace(/\s+$/, '');
}

function _setSourcesForPicture(element, srcsetDataAttribute) {
    var parent = element.parentElement;
    if (parent.tagName !== 'PICTURE') {
        return;
    }
    for (var i = 0; i < parent.children.length; i++) {
        var pictureChild = parent.children[i];
        if (pictureChild.tagName === 'SOURCE') {
            var sourceSrcset = pictureChild.getAttribute('data-' + srcsetDataAttribute);
            if (sourceSrcset) {
                pictureChild.setAttribute('srcset', sourceSrcset);
            }
        }
    }
}

function _setSources(element, srcsetDataAttribute, srcDataAttribute) {
    var tagName = element.tagName;
    var elementSrc = element.getAttribute('data-' + srcDataAttribute);
    if (tagName === "IMG") {
        _setSourcesForPicture(element, srcsetDataAttribute);
        var imgSrcset = element.getAttribute('data-' + srcsetDataAttribute);
        if (imgSrcset) element.setAttribute("srcset", imgSrcset);
        if (elementSrc) element.setAttribute("src", elementSrc);
        return;
    }
    if (tagName === "IFRAME") {
        if (elementSrc) element.setAttribute("src", elementSrc);
        return;
    }
    element.style.backgroundImage = "url(" + elementSrc + ")";
}

function _bind(fn, obj) {
    return function () {
        return fn.apply(obj, arguments);
    };
}

var LazyLoad = function () {
    function LazyLoad(instanceSettings) {
        _classCallCheck(this, LazyLoad);

        this._settings = _merge_objects(_defaultSettings, instanceSettings);
        this._queryOriginNode = this._settings.container === window ? document : this._settings.container;

        this._previousLoopTime = 0;
        this._loopTimeout = null;

        this._handleScrollFn = _bind(this.handleScroll, this);

        _addEventListener(window, "resize", this._handleScrollFn);
        this.update();
    }

    /*
     * PRIVATE FUNCTIONS *RELATED* TO A SPECIFIC INSTANCE OF LAZY LOAD
     * ---------------------------------------------------------------
     */

    _createClass(LazyLoad, [{
        key: "_showOnAppear",
        value: function _showOnAppear(element) {
            var settings = this._settings;

            function loadCallback() {
                /* As this method is asynchronous, it must be protected against external destroy() calls */
                if (settings === null) {
                    return;
                }
                /* Calling LOAD callback */
                if (settings.callback_load) {
                    settings.callback_load(element);
                }
                _removeClass(element, settings.class_loading);
                _addClass(element, settings.class_loaded);
                _removeEventListener(element, "load", loadCallback);
            }

            if (element.tagName === "IMG" || element.tagName === "IFRAME") {
                _addEventListener(element, "load", loadCallback);
                _addEventListener(element, "error", function () {
                    _removeEventListener(element, "load", loadCallback);
                    _removeClass(element, settings.class_loading);
                    if (settings.callback_error) {
                        settings.callback_error(element);
                    }
                });
                _addClass(element, settings.class_loading);
            }

            _setSources(element, settings.data_srcset, settings.data_src);
            /* Calling SET callback */
            if (settings.callback_set) {
                settings.callback_set(element);
            }
        }
    }, {
        key: "_loopThroughElements",
        value: function _loopThroughElements() {
            var i = void 0,
                element = void 0,
                settings = this._settings,
                elements = this._elements,
                elementsLength = !elements ? 0 : elements.length,
                processedIndexes = [];

            for (i = 0; i < elementsLength; i++) {
                element = elements[i];
                /* If must skip_invisible and element is invisible, skip it */
                if (settings.skip_invisible && element.offsetParent === null) {
                    continue;
                }
                if (_isInsideViewport(element, settings.container, settings.threshold)) {
                    this._showOnAppear(element);

                    /* Marking the element as processed. */
                    processedIndexes.push(i);
                    element.wasProcessed = true;
                }
            }
            /* Removing processed elements from this._elements. */
            while (processedIndexes.length > 0) {
                elements.splice(processedIndexes.pop(), 1);
                /* Calling the end loop callback */
                if (settings.callback_processed) {
                    settings.callback_processed(elements.length);
                }
            }
            /* Stop listening to scroll event when 0 elements remains */
            if (elementsLength === 0) {
                this._stopScrollHandler();
            }
        }
    }, {
        key: "_purgeElements",
        value: function _purgeElements() {
            var i = void 0,
                element = void 0,
                elements = this._elements,
                elementsLength = elements.length,
                elementsToPurge = [];

            for (i = 0; i < elementsLength; i++) {
                element = elements[i];
                /* If the element has already been processed, skip it */
                if (element.wasProcessed) {
                    elementsToPurge.push(i);
                }
            }
            /* Removing elements to purge from this._elements. */
            while (elementsToPurge.length > 0) {
                elements.splice(elementsToPurge.pop(), 1);
            }
        }
    }, {
        key: "_startScrollHandler",
        value: function _startScrollHandler() {
            if (!this._isHandlingScroll) {
                this._isHandlingScroll = true;
                _addEventListener(this._settings.container, "scroll", this._handleScrollFn);
            }
        }
    }, {
        key: "_stopScrollHandler",
        value: function _stopScrollHandler() {
            if (this._isHandlingScroll) {
                this._isHandlingScroll = false;
                _removeEventListener(this._settings.container, "scroll", this._handleScrollFn);
            }
        }

        /*
         * PUBLIC FUNCTIONS
         * ----------------
         */

    }, {
        key: "handleScroll",
        value: function handleScroll() {
            var remainingTime = void 0,
                now = void 0,
                throttle = void 0;

            // IE8 fix for destroy() malfunctioning
            if (!this._settings) {
                return;
            }

            now = _now();
            throttle = this._settings.throttle;

            if (throttle !== 0) {
                remainingTime = throttle - (now - this._previousLoopTime);
                if (remainingTime <= 0 || remainingTime > throttle) {
                    if (this._loopTimeout) {
                        clearTimeout(this._loopTimeout);
                        this._loopTimeout = null;
                    }
                    this._previousLoopTime = now;
                    this._loopThroughElements();
                } else if (!this._loopTimeout) {
                    this._loopTimeout = setTimeout(_bind(function () {
                        this._previousLoopTime = _now();
                        this._loopTimeout = null;
                        this._loopThroughElements();
                    }, this), remainingTime);
                }
            } else {
                this._loopThroughElements();
            }
        }
    }, {
        key: "update",
        value: function update() {
            this._elements = _convertToArray(this._queryOriginNode.querySelectorAll(this._settings.elements_selector));
            this._purgeElements();
            this._loopThroughElements();
            this._startScrollHandler();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            _removeEventListener(window, "resize", this._handleScrollFn);
            if (this._loopTimeout) {
                clearTimeout(this._loopTimeout);
                this._loopTimeout = null;
            }
            this._stopScrollHandler();
            this._elements = null;
            this._queryOriginNode = null;
            this._settings = null;
        }
    }]);

    return LazyLoad;
}();

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else {
        root.LazyLoad = factory();
    }
})(window, function () {
    return LazyLoad;
});
