TODO v11
========

* [x] Review dist file names
* [ ] Remove webP option, it isn't needed
* [ ] Review API names
* [ ] Review callbacks - now that .load() and .loadAll() exist, in the `reveal` function we should have another callback to notify "start loading" and `callback_enter` should be moved outside of the `reveal` function, just to notify that the element entered the viewport -- BREAKING CHANGE!

Demos
---

* [ ] Callbacks demo can be merged with all others
* [ ] Document inclusione via script sync, script async with auto init, async with auto init + store the instance, 

Callbacks review
---

* [ ] Enter callback should: 
  * [ ] be changed to "before set" instead of enter
  * [ ] be moved to the reveal function
  * [ ] accept a return value in order to change the url of the image

Documentation
---

* [ ] Remove that Array.prototype.slice.call and use Array.from on the elements nodeset?

* [ ] PurgeElements can be avoided if we `querySelectorAll` with a "not `[data-was-processed]`" selector?

* [ ] Test more modules
  * [ ] autoinitialize
  * [ ] purge
  * [ ] reveal
