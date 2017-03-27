(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.LazyLoad = factory();
    }
}(this, function () {

    class LazyLoad {
        constructor(instanceSettings) {
            const _defaultSettings = {
                elements_selector: "img",
                container: window,
                threshold: 300,
                throttle: 150,
                data_src: "original",
                data_srcset: "original-set",
                class_loading: "loading",
                class_loaded: "loaded",
                skip_invisible: true,
                callback_load: null,
                callback_error: null,
                callback_set: null,
                callback_processed: null
            };

            this._settings = Object.assign({}, _defaultSettings, instanceSettings);
            this._queryOriginNode = this._settings.container === window ? document : this._settings.container;

            this._previousLoopTime = 0;
            this._loopTimeout = null;
            this._boundHandleScroll = this.handleScroll.bind(this);

            window.addEventListener("resize", this._boundHandleScroll);
            this.update();
        }

        _isInsideViewport(element, container, threshold) {
            const ownerDocument = element.ownerDocument;
            const documentTop = window.pageYOffset || ownerDocument.body.scrollTop;
            const documentLeft = window.pageXOffset || ownerDocument.body.scrollLeft;

            const _isBelowViewport = function () {
                let fold;
                const _getTopOffset = (element) => element.getBoundingClientRect().top + documentTop - ownerDocument.documentElement.clientTop;
                if (container === window) {
                    fold = window.innerHeight + documentTop;
                } else {
                    fold = _getTopOffset(container) + container.offsetHeight;
                }
                return fold <= _getTopOffset(element) - threshold;
            };

            const _isAtRightOfViewport = function () {
                let fold;
                const documentWidth = window.innerWidth;
                const _getLeftOffset = (element) => element.getBoundingClientRect().left + documentLeft - ownerDocument.documentElement.clientLeft;
                if (container === window) {
                    fold = documentWidth + window.pageXOffset;
                } else {
                    fold = _getLeftOffset(container) + documentWidth;
                }
                return fold <= _getLeftOffset(element) - threshold;
            };

            const _isAboveViewport = function () {
                let fold;
                if (container === window) {
                    fold = documentTop;
                } else {
                    fold = _getTopOffset(container);
                }
                return fold >= _getTopOffset(element) + threshold + element.offsetHeight;
            };

            const _isAtLeftOfViewport = function () {
                let fold;
                if (container === window) {
                    fold = documentLeft;
                } else {
                    fold = _getLeftOffset(container);
                }
                return fold >= _getLeftOffset(element) + threshold + element.offsetWidth;
            };

            return !_isBelowViewport() && !_isAboveViewport() && !_isAtRightOfViewport() && !_isAtLeftOfViewport();
        }

        _setSourcesForPicture(element, srcsetDataAttribute) {
            const parent = element.parentElement;
            if (parent.tagName !== 'PICTURE') {
                return;
            }
            for (let i = 0; i < parent.children.length; i++) {
                let pictureChild = parent.children[i];
                if (pictureChild.tagName === 'SOURCE') {
                    let sourceSrcset = pictureChild.getAttribute('data-' + srcsetDataAttribute);
                    if (sourceSrcset) {
                        pictureChild.setAttribute('srcset', sourceSrcset);
                    }
                }
            }
        }

        _setSources(element, srcsetDataAttribute, srcDataAttribute) {
            const tagName = element.tagName;
            const elementSrc = element.getAttribute('data-' + srcDataAttribute);
            if (tagName === "IMG") {
                this._setSourcesForPicture(element, srcsetDataAttribute);
                const imgSrcset = element.getAttribute('data-' + srcsetDataAttribute);
                if (imgSrcset) element.setAttribute("srcset", imgSrcset);
                if (elementSrc) element.setAttribute("src", elementSrc);
                return;
            }
            if (tagName === "IFRAME") {
                if (elementSrc) element.setAttribute("src", elementSrc);
                return;
            }
            if (elementSrc) element.style.backgroundImage = "url(" + elementSrc + ")";
        }

        _showOnAppear(element) {
            const settings = this._settings;

            const errorCallback = function () {
                element.removeEventListener("load", loadCallback);
                element.classList.remove(settings.class_loading);
                if (settings.callback_error) {
                    settings.callback_error(element);
                }
            }

            function loadCallback() {
                /* As this method is asynchronous, it must be protected against external destroy() calls */
                if (settings === null) {
                    return;
                }
                /* Calling LOAD callback */
                if (settings.callback_load) {
                    settings.callback_load(element);
                }
                element.classList.remove(settings.class_loading);
                element.classList.add(settings.class_loaded);
                element.removeEventListener("load", loadCallback);
                element.removeEventListener("error", errorCallback);
            }

            if (element.tagName === "IMG" || element.tagName === "IFRAME") {
                element.addEventListener("load", loadCallback);
                element.addEventListener("error", errorCallback);
                element.classList.add(settings.class_loading);
            }

            this._setSources(element, settings.data_srcset, settings.data_src);
            /* Calling SET callback */
            if (settings.callback_set) {
                settings.callback_set(element);
            }
        }

        _loopThroughElements() {
            const settings = this._settings,
                elements = this._elements,
                elementsLength = (!elements) ? 0 : elements.length;
            let i,
                processedIndexes = [];

            for (i = 0; i < elementsLength; i++) {
                let element = elements[i];
                /* If must skip_invisible and element is invisible, skip it */
                if (settings.skip_invisible && (element.offsetParent === null)) {
                    continue;
                }
                if (this._isInsideViewport(element, settings.container, settings.threshold)) {
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

        _purgeElements() {
            const elements = this._elements,
                elementsLength = elements.length;
            let i,
                elementsToPurge = [];

            for (i = 0; i < elementsLength; i++) {
                let element = elements[i];
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

        _startScrollHandler() {
            if (!this._isHandlingScroll) {
                this._isHandlingScroll = true;
                this._settings.container.addEventListener("scroll", this._boundHandleScroll);
            }
        }

        _stopScrollHandler() {
            if (this._isHandlingScroll) {
                this._isHandlingScroll = false;
                this._settings.container.removeEventListener("scroll", this._boundHandleScroll);
            }
        }


        handleScroll() {
            const throttle = this._settings.throttle;

            if (throttle !== 0) {
                const getTime = () => { (new Date()).getTime(); };
                let now = getTime();
                let remainingTime = throttle - (now - this._previousLoopTime);
                if (remainingTime <= 0 || remainingTime > throttle) {
                    if (this._loopTimeout) {
                        clearTimeout(this._loopTimeout);
                        this._loopTimeout = null;
                    }
                    this._previousLoopTime = now;
                    this._loopThroughElements();
                } else if (!this._loopTimeout) {
                    this._loopTimeout = setTimeout(function () {
                        this._previousLoopTime = getTime();
                        this._loopTimeout = null;
                        this._loopThroughElements();
                    }.bind(this), remainingTime);
                }
            } else {
                this._loopThroughElements();
            }
        }

        update() {
            // Converts to array the nodeset obtained querying the DOM from _queryOriginNode with elements_selector
            this._elements = Array.prototype.slice.call(this._queryOriginNode.querySelectorAll(this._settings.elements_selector));
            this._purgeElements();
            this._loopThroughElements();
            this._startScrollHandler();
        }

        destroy() {
            window.removeEventListener("resize", this._boundHandleScroll);
            if (this._loopTimeout) {
                clearTimeout(this._loopTimeout);
                this._loopTimeout = null;
            }
            this._stopScrollHandler();
            this._elements = null;
            this._queryOriginNode = null;
            this._settings = null;
        }
    }

    return LazyLoad;

}));
