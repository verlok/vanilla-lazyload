/*
 * Lazy Load - for lazy loading images without jQuery
 */

LazyLoad = function (instanceSettings) {

	var _defaultSettings = {
			elementsSelector: "img",
			container: window,
			threshold: 0,
			src_data_attribute: "original",
			skip_invisible: true,
			show_while_loading: false,
			load_callback: null,
			set_callback: null,
			processed_callback: null,
			placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
		},
		_supportsAddEventListener = !!window.addEventListener,
		_supportsAttachEvent = !!window.attachEvent;

	/*
	 * PRIVATE FUNCTIONS *NOT* RELATED TO A SPECIFIC INSTANCE OF LAZY LOAD
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
			element.attachEvent('on' + eventName, (function (el) {
				return function () {
					callback.call(el, window.event);
				};
			}(element)));
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

	function _getOffset(element) {
		var theBox = element.getBoundingClientRect(),
			documentElement = element.ownerDocument.documentElement,
			documentTop = window.pageYOffset || document.body.scrollTop,
			documentLeft = window.pageXOffset || document.body.scrollLeft;
		return {
			top: theBox.top + documentTop - documentElement.clientTop,
			left: theBox.left + documentLeft - documentElement.clientLeft
		};
	}

	function _getDocumentWidth() {
		return window.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth); //Math.max(visibleWidth, document.body.scrollWidth);
	}

	function _getDocumentHeight() {
		return window.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight); //Math.max(visibleHeight, document.body.scrollHeight);
	}

	function _isBelowViewport(element, container, threshold) {
		var fold;
		if (container === window) {
			fold = _getDocumentHeight() + (window.pageYOffset || document.body.scrollTop);
		} else {
			fold = _getOffset(container).top + container.offsetHeight;
		}
		return fold <= _getOffset(element).top - threshold;
	}

	function _isAtRightOfViewport(element, container, threshold) {
		var fold;
		if (container === window) {
			fold = _getDocumentWidth() + (window.pageXOffset || document.body.scrollLeft);
		} else {
			fold = _getOffset(container).left + _getDocumentWidth();
		}
		return fold <= _getOffset(element).left - threshold;
	}

	function _isAboveViewport(element, container, threshold) {
		var fold;
		if (container === window) {
			fold = window.pageYOffset || document.body.scrollTop;
		} else {
			fold = _getOffset(container).top;
		}
		return fold >= _getOffset(element).top + threshold + element.offsetHeight;
	}

	function _isAtLeftOfViewport(element, container, threshold) {
		var fold;
		if (container === window) {
			fold = window.pageXOffset || document.body.scrollLeft;
		} else {
			fold = _getOffset(container).left;
		}
		return fold >= _getOffset(element).left + threshold + element.offsetWidth;
	}

	function _isInsideViewport(element, container, threshold) {

		var isAboveViewport = _isAboveViewport(element, container, threshold);
		var isAtLeftOfViewport = _isAtLeftOfViewport(element, container, threshold);
		var isBelowViewport = _isBelowViewport(element, container, threshold);
		var isAtRightOfViewport = _isAtRightOfViewport(element, container, threshold);

		return !isAboveViewport && !isAtLeftOfViewport && !isBelowViewport && !isAtRightOfViewport;
	}

	function _merge_options(obj1, obj2) {
		var obj3 = {}, propertyName;
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

	function _getSrc(element, dataAttribute, placeholder) {
		var dataAttributeContent;
		dataAttributeContent = element.getAttribute(dataAttribute);
		return dataAttributeContent || placeholder;
	}

	function _isHidden(element) {
		return (element.offsetParent === null);
	}

	function _convertToArray(nodeSet) {
		var array, i, l;
		try {
			return Array.prototype.slice.call(nodeSet);
		}
		catch (e) {
			array = [];
			l = nodeSet.length;
			for (i = 0; i < l; i++) {
				array.push(nodeSet[i]);
			}
			return array;
		}
	}

	/*
	 * PRIVATE FUNCTIONS *RELATED* TO A SPECIFIC INSTANCE OF LAZY LOAD
	 * ---------------------------------------------------------------
	 */

	this._setImageAndDisplay = function (element) {
		var settings, src;
		/* Setting `src` in the original `img` */
		settings = this._settings;
		src = _getSrc(element, 'data-' + settings.src_data_attribute, settings.placeholder);
		if (element.nodeName.toLowerCase() === "img") {
			element.setAttribute("src", src);
		} else {
			element.style.backgroundImage = "url('" + src + "')";
		}
		if (settings.set_callback) {
			settings.set_callback(element);
		}
	};

	this._showOnLoad = function (element) {
		var fakeImg, settings, that = this;
		settings = this._settings;
		/* If no src attribute given use data:uri. */
		if (!element.getAttribute("src")) {
			element.setAttribute("src", settings.placeholder);
		}
		/* Creating a new `img` in a DOM fragment. */
		fakeImg = document.createElement('img');
		/* Listening to the load event */
		function loadCallback() {
			if (settings.load_callback) {
				settings.load_callback(element);
			}
			that._setImageAndDisplay(element);
			_removeEventListener(fakeImg, "load", loadCallback);
		}
		_addEventListener(fakeImg, "load", loadCallback);
		/* Setting the source in the fake image */
		fakeImg.setAttribute("src", _getSrc(element));
	};

	this._showOnAppear = function (element) {
		var settings;
		settings = this._settings;
		function loadCallback() {
			if (settings.load_callback) {
				settings.load_callback(element);
			}
			_removeEventListener(element, "load", loadCallback);
		}
		_addEventListener(element, "load", loadCallback);
		this._setImageAndDisplay(element);
	};

	this._processImage = function (element, showWhileLoading) {
		/* Forking behaviour depending on show_while_loading (true value is ideal for progressive jpeg). */
		if (showWhileLoading) {
			this._showOnAppear(element);
		} else {
			this._showOnLoad(element);
		}
	};

	this._loopThroughElements = function () {
		var processedIndexes, i, l, settings, elements, element;
		if (!this._elements.length) {
			return;
		}
		processedIndexes = [];
		elements = this._elements;
		settings = this._settings;
		l = elements.length;
		for (i=0; i<l; i++) {
			element = elements[i];
			if (settings.skip_invisible && _isHidden(element)) {
				return;
			}
			if (_isInsideViewport(element, settings.container, settings.threshold)) {
				this._processImage(element, settings.show_while_loading);
				/* Marking the element index as processed. */
				processedIndexes.push(i);
			}
		}
		/* Removing processed elements from this._elements. */
		while (processedIndexes.length) {
			elements.splice(processedIndexes.pop(), 1);
			/* Calling the end loop callback */
			if (settings.processed_callback) {
				settings.processed_callback(elements.length);
			}
		}

	};

	/* INITIALIZE (constructor) */

	this._settings = _merge_options(_defaultSettings, instanceSettings);
	this._elements = _convertToArray((this._settings.container === window ? document : this._settings.container).querySelectorAll(this._settings.elementsSelector));

	_addEventListener(this._settings.container, "scroll", (function (_this) {
		return function () {
			_this._loopThroughElements();
		};
	})(this));
	this._loopThroughElements();

};