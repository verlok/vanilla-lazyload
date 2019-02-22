TODO v11
========

* [x] Review dist file names
* [x] Remove webP option
* [x] Review API names
* [x] Review callbacks - now that .load() and .loadAll() exist, in the `reveal` function we should have another callback to notify "start loading" and `callback_enter` should be moved outside of the `reveal` function, just to notify that the element entered the viewport -- BREAKING CHANGE!

Demos
---

* [x] Callbacks demo merged with others

Reveal callback review
---

* [ ] Reveal callback should accept a return value in order to change the url of the image (don't know why, but who knows)

Documentation
---

* [ ] Document inclusion via script sync, script async with auto init, async with auto init + store the instance, 
* [ ] Remove that Array.prototype.slice.call and use Array.from on the elements nodeset?

* [ ] PurgeElements can be avoided if we `querySelectorAll` with a "not `[data-was-processed]`" selector?

* [ ] Test more modules
  * [ ] autoinitialize
  * [ ] purge
  * [ ] reveal
