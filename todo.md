# TODO v12

## Support native lazyloading

(see https://addyosmani.com/blog/lazy-loading/)

* if `settings.use_native` && `('loading' in HTMLImageElement.prototype)`
  * Filter elements for `["IMG", "IFRAME"]`, and for these
    * Set the `loading` attribute to `lazy`
    * `reveal()` them
* then, initialize LazyLoad as usual (so they can lazyload videos too)

Done!

## Test

Test native `img`, native `iframe`, alone or in conjunction with `video`s

Test more modules

* [ ] autoinitialize
* [ ] purge
* [ ] reveal