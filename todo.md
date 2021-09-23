# TODO

## THIS BRANCH!

I've implemented a "reverse DOM to original" feature as requested in #509.
New method is: `lazyloadInstance.restoreAll()`.
Beta testers are testing it and will let me know in the comments.

NOTES: 
- `restore()` is executed called even on images what has not started loading yet -- maybe select only the images that have status >= loading.
- `restore()` is executed also on natively loaded elements - maybe select only the images that have status >= loading and != native.

## For testing

- Rename and expose under `window` all lazyload instances in the `/demo/*`s, e.g. `window.pageLazyLoad`.

## Coming next

- Check how LazyLoad behaves when a page was updated using DOM morphing.
  If only the data-attributes were updated, how do one forces LazyLoad to read from them again?
- Check out how the plugin architecture of lazysizes work
- Consider creating a subset of options and defaults for the static `load` method, and document it
- [Edge case] When `cancel_on_exit` is `false`, unobserve elements as soon as they start loading (as of before 15.2.0).

## Test

- Test more modules and functions, coverage!!!
- Test native `img`, native `iframe`, alone or in conjunction with `video`s.

Test more modules

- [ ] autoinitialize
- [ ] purge
- [ ] reveal
