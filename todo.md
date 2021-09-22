# TODO

## THIS BRANCH!

I'm implementing a "reverse DOM to original" feature as requested in #509.
Function will be: `lazyloadInstance.restoreAll()`.

Next steps:
- Write a test to make sure `restore` also reset the status of the element
- Create a demo to test it

NOTE: `restoreAll` brings DOM back to original state, but it doesn't destroy lazyload, so you probably want to use it along with `destroy` on TurboLinks. Otherwise, it could potentially load more images. You also probably want to fire `restoreAll` and `destroy` when `loadingCount` is 0. When not `destroy`ing the instance, the `update` method could be called to restart loading restored images.

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
