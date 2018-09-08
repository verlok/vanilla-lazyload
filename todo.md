TODO
====

* Callbacks demo can be merged with all others
* Enter callback should: 
  * be changed to "before set" instead of enter
  * be moved to the reveal function
  * accept a return value in order to change the url of the image
* Missing documenation
    * Constructor takes a nodeset as 2nd parameter, see 10.2 release
    * `update()` takes with the NodeSet object - see 10.2 release
* Remove that Array.prototype.slice.call and use Array.from on the elements nodeset?
* PurgeElements can be avoided if we `querySelectorAll` with a "not `[data-was-processed]`" selector?
* Test more modules
    * autoinitialize
    * purge
    * reveal
* revealElement (breaking change)
    * now that .load() and .loadAll() now exist, in the `reveal` function we should have another callback to notify "start loading" and `callback_enter` should be moved outside of the `reveal` function, just to notify that the element entered the viewport -- BREAKING CHANGE!
* check why on load.html the "loaded" callback is called twice in some cases