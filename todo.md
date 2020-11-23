# TODO

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
