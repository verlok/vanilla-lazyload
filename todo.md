TODO
====

* Missing documenation
    * Constructor takes a nodeset as 2nd parameter, see 10.2 release
    * `update()` takes with the NodeSet object - see 10.2 release
* Remove that Array.prototype.slice.call and use Array.from on the elements nodeset?
* PurgeElements can be avoided if we `querySelectorAll` with a "not `[data-was-processed]`" selector?
* Test more modules
    * autoinitialize
    * purge
    * reveal