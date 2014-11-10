/*
 * Lazy Load - for lazy loading images without jQuery
 */

var lazyLoad = (function (window, document, undefined) {

	var _elements, _settings,
		_defaultSettings = {
			threshold: 0,
			failure_limit: 0,
			event: "scroll",
			effect: "show",
			container: window,
			data_attribute: "original",
			//skip_invisible: true, // TODO: Restore this
			show_on_appear: false,
			appear_callback: null,
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
		var visibleWidth = window.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth);
		return visibleWidth; //Math.max(visibleWidth, document.body.scrollWidth);
	}

	function _getDocumentHeight() {
		var visibleHeight = window.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight);
		return visibleHeight; //Math.max(visibleHeight, document.body.scrollHeight);
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

	/*function _isInsideViewport(element) {
	 return !_isAtRightOfViewport(element) && !_isAtLeftOfViewport(element) && !_isBelowViewport(element) && !_isAboveViewport(element);
	 };*/

	/**
	 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	 * @param obj1
	 * @param obj2
	 * @returns obj3 a new object based on obj1 and obj2
	 */
	function _merge_options(obj1, obj2) {
		var obj3 = {}, propertyName;
		for (propertyName in obj1) {
			obj3[propertyName] = obj1[propertyName];
		}
		for (propertyName in obj2) {
			obj3[propertyName] = obj2[propertyName];
		}
		return obj3;
	}

	function _getOriginalSrc(element) {
		var dataAttributeContent;
		dataAttributeContent = element.getAttribute('data-' + _settings.data_attribute);
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

	function _removeFromArray(element) {
		/* Remove element from array so it is not looped next time. */
		// TODO: Optimization, please do this
		/*
		 element.processed = true;
		 var temp = $.grep(elements, function (foundEl) {
		 return !foundEl.processed;
		 });
		 elements = $(temp);
		 */
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
				_removeFromArray(element);
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
		_removeFromArray(element);
		_setImageAndDisplay(element);
	}

	function _onAppearHandler(element) {
		if (!element.processed) {
			_callCallback(element, "appear");
			/* Forking behaviour depending on show_on_appear (true value is ideal for progressive jpeg). */
			if (_settings.show_on_appear) {
				_showOnAppear(element);
			} else {
				_showOnLoad(element);
			}
		}
	}

	function _forEach(elements, callback) {
		Array.prototype.forEach.call(elements, callback);
	}

	return {

		initialize: function (elements, options) {
			_elements = elements;
			_settings = _merge_options(_defaultSettings, options);
			lazyLoad.update();

			if (_supportsAddEventListener) {
				/* Add scroll event listener in the container, not in the image. */
				if (0 === _settings.event.indexOf("scroll")) {
					_settings.container.addEventListener(_settings.event, function () {
						return lazyLoad.update();
					});
				}
				else {
					_forEach(_elements, function (element) {
						element.addEventListener(_settings.event, function () {
							if (!element.processed) {
								_onAppearHandler(element);
							}
						});
					});
				}
			}
			else {
				// TODO: fallback for IE<9
			}
		},

		update: function () {
			var countBeforeFail = 0;
			_forEach(_elements, function (element) {

				// TODO: Find a way to replicate "isVisible"
				/*if (_settings.skip_invisible && !$this.is(":visible")) {
				 return;
				 }*/
				if (_isAboveViewport(element) ||
					_isAtLeftOfViewport(element)) {
					/* Nothing. */
				} else if (!_isBelowViewport(element) && !_isAtRightOfViewport(element)) {
					_onAppearHandler(element);
					/* If we found an image we'll load, reset the counter */
					countBeforeFail = 0;
				} else {
					if (++countBeforeFail > _settings.failure_limit) {
						// This should break the forEach, does it?
						return false;
					}
				}
			});
		}

	};

}(window, document));