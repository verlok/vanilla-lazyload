# TODO v12

## Support native lazyloading

(see https://addyosmani.com/blog/lazy-loading/)

### Option 1

**Right after elements have been selected and added to the IntersectionObserver:**

* If `use_native` option is `false` --> *don't do anything*.
* Feature detect if `loading` is supported in images with `if ('loading' in HTMLImageElement.prototype)`. If not --> *don't do anything*.
* Set the `loading` attribute to `lazy` in `["IMG", "IFRAME"]` tags
* For `"IMG"` and `"IFRAME"`, `revealAndUnobserve`

### Option 2

**Embedded in LazyLoad's code, before initialization.**

* if `use_native` is `true` and `img`'s `loading` is supported
  * Filter elements for `["IMG", "IFRAME"]`
  * Set the `loading` attribute to `lazy`
  * `reveal()` them
* otherwise, initialize LazyLoad as usual

### Option 3

**In a plugin that feature detects if `loading` is supported.**

If not supported, download and initialize LazyLoad with the provided options.

If supported, set the `loading` attribute to `lazy` in `["IMG", "IFRAME"]` tags
`reveal()`-like all the `["IMG", "IFRAME"]`'s selected

---

That's pretty much it.

## Test

Test more modules

* [ ] autoinitialize
* [ ] purge
* [ ] reveal