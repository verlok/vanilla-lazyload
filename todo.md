# TODO

## THIS BRANCH!

I'm implementing a "reverse DOM to original" feature as requested in #509.
Functions will be: `LazyLoad.restore(img)`, `lazyloadInstance.restoreAll()`.
I've divided `set`, `reset` and `restore` functions into 3 separate files, and shared functions are now in `originalAttributes.js` and `forEachSource.js`.
I've already exposed the `restore` static function on the LazyLoad object.

Next steps:
- Write the tests to make sure `restore` does things properly!
- Implement the methods to make it work

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
