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
			process_callback: null,
			load_callback: null,
			set_callback: null,
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
			documentElement = element.ownerDocument.documentElement;
		return {
			top: theBox.top + window.pageYOffset - documentElement.clientTop,
			left: theBox.left + window.pageXOffset - documentElement.clientLeft
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
			fold = _getDocumentHeight() + window.pageYOffset;
		} else {
			fold = _getOffset(container).top + container.offsetHeight;
		}
		return fold <= _getOffset(element).top - threshold;
	}

	function _isAtRightOfViewport(element, container, threshold) {
		var fold;
		if (container === window) {
			fold = _getDocumentWidth() + window.pageXOffset;
		} else {
			fold = _getOffset(container).left + _getDocumentWidth();
		}
		return fold <= _getOffset(element).left - threshold;
	}

	function _isAboveViewport(element, container, threshold) {
		var fold;
		if (container === window) {
			fold = window.pageYOffset;
		} else {
			fold = _getOffset(container).top;
		}
		return fold >= _getOffset(element).top + threshold + element.offsetHeight;
	}

	function _isAtLeftOfViewport(element, container, threshold) {
		var fold;
		if (container === window) {
			fold = window.pageXOffset;
		} else {
			fold = _getOffset(container).left;
		}
		return fold >= _getOffset(element).left + threshold + element.offsetWidth;
	}

	function _isInsideViewport(element, container, threshold) {
		/* TODO: Check if this can be optimized -- less function calls, all in here */
		return !_isAboveViewport(element, container, threshold) &&
			!_isAtLeftOfViewport(element, container, threshold) &&
			!_isBelowViewport(element, container, threshold) &&
			!_isAtRightOfViewport(element, container, threshold);
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


	/*
	 * PRIVATE FUNCTIONS *RELATED* TO A SPECIFIC INSTANCE OF LAZY LOAD
	 * ---------------------------------------------------------------
	 */

	this._setImageAndDisplay = function(element) {
		/* Setting `src` in the original `img` */
		var original = _getSrc(element, 'data-'+this._settings.src_data_attribute, this._settings.placeholder);
		if (element.nodeName.toLowerCase() === "img") {
			element.setAttribute("src", original);
		} else {
			element.style.backgroundImage = "url('" + original + "')";
		}
		this._callCallback(element, "set_callback");
	};

	this._callCallback = function(element, callbackName) {
		var settings = this._settings;
		if (settings[callbackName]) {
			settings[callbackName].call(element, this._elements.length, settings);
		}
	};

	this._showOnLoad = function(element) {
		var fakeImg, that = this;
		/* If no src attribute given use data:uri. */
		if (!element.getAttribute("src")) {
			element.setAttribute("src", _settings.placeholder);
		}
		/* Creating a new `img` in a DOM fragment. */
		fakeImg = document.createElement('img');
		/* Listening to the load event */
		_addEventListener(fakeImg, "load", function () {
			that._callCallback(element, "load_callback");
			that._setImageAndDisplay(element);
			_removeEventListener(fakeImg, "load");
		});
		/* Setting the source in the fake image */
		fakeImg.setAttribute("src", _getSrc(element));
	};

	this._showOnAppear = function(element) {
		var that= this;
		_addEventListener(element, "load", function () {
			that._callCallback(element, "load_callback");
			_removeEventListener(element, "load");
		});
		this._setImageAndDisplay(element);
	};

	this._processImage = function(element, showWhileLoading) {
		this._callCallback(element, "process_callback");
		/* Forking behaviour depending on show_while_loading (true value is ideal for progressive jpeg). */
		if (showWhileLoading) {
			this._showOnAppear(element);
		} else {
			this._showOnLoad(element);
		}
	};

	this._loopThroughElements = function () {
		var processedIndexes;
		if (!this._elements.length) {
			return;
		}
		processedIndexes = [];
		this._elements.forEach(function (element, index) {
			if (this._settings.skip_invisible && _isHidden(element)) {
				return;
			}
			if (_isInsideViewport(element, this._settings.container, this._settings.threshold)) {
				this._processImage(element, this._settings.show_while_loading);
				/* Marking the element index as processed. */
				processedIndexes.push(index);
			}
		}, this);
		/* Removing processed elements from this._elements. */
		while (processedIndexes.length) {
			this._elements.splice(processedIndexes.pop(), 1);
		}
	};

	/* INITIALIZE (constructor) */

	this._settings = _merge_options(_defaultSettings, instanceSettings);
	this._elements = Array.prototype.slice.call((this._settings.container === window ? document : this._settings.container).querySelectorAll(this._settings.elementsSelector));

	_addEventListener(this._settings.container, "scroll", this._loopThroughElements.bind(this));
	this._loopThroughElements();

};