TODO v12
========

(see https://addyosmani.com/blog/lazy-loading/)

## Option 1

Right after elements have been selected and added to the IntersectionObserver:

* If `use_native` option is `false` --> *don't do anything*.
* Feature detect if `loading` is supported in images with `if ('loading' in HTMLImageElement.prototype)`. If not --> *don't do anything*.
* Set the `loading` attribute to `lazy` in `["IMG", "IFRAME"]` tags
* For `"IMG"` and `"IFRAME"`, `revealAndUnobserve`

## Option 2

Before initialization, feature detect if `loading` is supported, and initialize LazyLoad if not.

---

That's pretty much it.

Test
---

Test more modules

* [ ] autoinitialize
* [ ] purge
* [ ] reveal