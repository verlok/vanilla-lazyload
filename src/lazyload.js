/*
 * Lazy Load - for lazy loading images without jQuery
 */

var lazyLoad = (function (window, document, undefined) {

	var _elements,
		_settings,
		_processedIndexes = [],
		_defaultSettings = {
			threshold: 0,
			event: "scroll",
			effect: "show",
			container: window,
			src_data_attribute: "original",
			skip_invisible: true,
			show_while_loading: false,
			process_callback: null,
			load_callback: null,
			set_callback: null,
			placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
		},
		_supportsAddEventListener = !!window.addEventListener;

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

	function _isBelowViewport(element) {
		var fold,
			container = _settings.container;

		if (container === undefined || container === window) {
			fold = _getDocumentHeight() + window.pageYOffset;
		} else {
			fold = _getOffset(container).top + container.offsetHeight;
		}

		return fold <= _getOffset(element).top - _settings.threshold;
	}

	function _isAtRightOfViewport(element) {
		var fold,
			container = _settings.container;

		if (container === undefined || container === window) {
			fold = _getDocumentWidth() + window.pageXOffset;
		} else {
			fold = _getOffset(container).left + _getDocumentWidth();
		}

		return fold <= _getOffset(element).left - _settings.threshold;
	}

	function _isAboveViewport(element) {
		var fold,
			container = _settings.container;

		if (container === undefined || container === window) {
			fold = window.pageYOffset;
		} else {
			fold = _getOffset(container).top;
		}

		return fold >= _getOffset(element).top + _settings.threshold + element.offsetHeight;
	}

	function _isAtLeftOfViewport(element) {
		var fold,
			container = _settings.container;

		if (container === undefined || container === window) {
			fold = window.pageXOffset;
		} else {
			fold = _getOffset(container).left;
		}

		return fold >= _getOffset(element).left + _settings.threshold + element.offsetWidth;
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

	function _getOriginalSrc(element) {
		var dataAttributeContent;
		dataAttributeContent = element.getAttribute('data-' + _settings.src_data_attribute);
		return dataAttributeContent || _settings.placeholder;
	}

	function _setImageAndDisplay(element) {
		/* Setting `src` in the original `img` */
		var original = _getOriginalSrc(element);
		if (element.nodeName.toLowerCase() === "img") {
			element.setAttribute("src", original);
		} else {
			element.style.backgroundImage = "url('" + original + "')";
		}
		_callCallback(element, "set_callback");
	}

	function _callCallback(element, callbackName) {
		if (_settings[callbackName]) {
			_settings[callbackName].call(element, _elements.length, _settings);
		}
	}

	function _showOnLoad(element) {

		var fakeImg;

		/* If no src attribute given use data:uri. */
		if (!element.getAttribute("src")) {
			element.setAttribute("src", _settings.placeholder);
		}
		/* Creating a new `img` in a DOM fragment. */
		fakeImg = document.createElement('img');
		/* Listening to the load event */
		if (_supportsAddEventListener) {
			fakeImg.addEventListener("load", function () {
				_callCallback(element, "load_callback");
				_setImageAndDisplay(element);
				fakeImg.removeEventListener("load");
			});
		}
		else {
			// TODO: fallback for IE<9
		}
		/* Setting the source in the fake image */
		fakeImg.setAttribute("src", _getOriginalSrc(element));
	}

	function _showOnAppear(element) {
		if (_supportsAddEventListener) {
			element.addEventListener("load", function () {
				_callCallback(element, "load_callback");
				element.removeEventListener("load");
			});
		}
		else {
			// TODO: fallback for IE<9
		}
		_setImageAndDisplay(element);
	}

	function _processImage(element, index) {
		//if (-1 === _processedElements.indexOf(element)) { // TODO: This check is necessary? (evaluate not only the scroll event case)
			_callCallback(element, "process_callback");
			/* Forking behaviour depending on show_while_loading (true value is ideal for progressive jpeg). */
			if (_settings.show_while_loading) {
				_showOnAppear(element);
			} else {
				_showOnLoad(element);
			}
			/* Marking the element index as processed. */
			_processedIndexes.push(index);
		//}
	}

	function _isHidden(element) {
		return (element.offsetParent === null);
	}

	return {
		initialize: function (elements, options) {
			_elements = Array.prototype.slice.call(elements, 0);
			_settings = _merge_options(_defaultSettings, options);

			if (_supportsAddEventListener) {
				/* If event is scroll, add scroll event listener in the container (not in every single image) */
				if (0 === _settings.event.indexOf("scroll")) {
					_settings.container.addEventListener(_settings.event, function () {
						return lazyLoad.update();
					});
				}
				/* If event is not, add event listener every single image */
				else {
					_elements.forEach(function (element) {
						element.addEventListener(_settings.event, function () {
							_processImage(element);
						});
					});
				}
			}
			else {
				// TODO: fallback for IE<9
			}

			lazyLoad.update();
		},
		update: function () {
			_elements.forEach(function (element, index) {

				if (_settings.skip_invisible && _isHidden(element)) {
					return;
				}

				if (_isAboveViewport(element) || _isAtLeftOfViewport(element)) {
					/* Do nothing. */
				} else if (!_isBelowViewport(element) && !_isAtRightOfViewport(element)) {
					_processImage(element, index);
				}
			});

			/* Removing processed elements from _elements. */
			while (_processedIndexes.length) {
				_elements.splice(_processedIndexes.pop(), 1);
			}

		}
	};

}(window, document));